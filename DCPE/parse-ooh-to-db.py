# by Greg Albert

import xml.etree.ElementTree as ET
import re
import html
from pymongo import MongoClient

# for populating checkbox options with unique values
qfExpUnique = []
qfEduUnique = []
qfSkillsUnique = []

def parse_xml(xml_file_path):
    try:
        # Parse the XML file
        tree = ET.parse(xml_file_path)
        root = tree.getroot()

        # Process the XML tree
        data = process_element(root)

        return data

    except ET.ParseError as e:
        print(f"Error parsing XML: {e}")
        return None

# needed to process html wrapped in the string caster <![CDATA[]]>
def parse_cdata_regex(element, regex):
    # Check if the element has text content
    if element.text is not None:
        cdata_content = element.text.strip()

        # return the match item from passed regex as list
        text_match = re.findall(regex, cdata_content, flags=re.DOTALL)

        if text_match:
            fixed_list = []
            
            for match in text_match:
                # remove escape characters, leftover tags, and whitespace from either end
                fixed_index = re.sub(r'<.*?>', '', html.unescape(match), flags=re.DOTALL).strip()

                # remove '.' and 'skills' from list of skills
                if len(text_match) > 1:
                    fixed_index = re.sub(r'\.+$', '', fixed_index).strip()
                
                fixed_list.append(fixed_index)           
            
            return fixed_list        
        else: return ("error")   

    return "regex error"

def has_text(elem):
    return True if (elem is not None and elem.text is not None) else False

def pushUnique(listOrStr, arr: list):
    
    variations_to_bypass = [
        "training for enlisted personnel",
        "training for warrant officers",
        "training for officers in the federal service academies",
        "training for officers in ROTC programs",
        "training for officers through OCS or OTS",
        "training for officers through the Uniformed Services University of the Health Sciences",
        "training for officers through direct appointments"
    ]
    
    strList = listOrStr
    if isinstance(listOrStr, str):
        # If a string is passed, convert it to a list
        strList = [listOrStr]
    elif not isinstance(listOrStr, list):
        # Handle other types or invalid input gracefully
        print("Invalid input. Expected a string or a list.")
        return
    
    for string in strList:
        if string:
            string = string[0].lower() + string[1:]
            if string != "skills" and string not in arr:
                if "enlisted personnel training" not in arr and string in variations_to_bypass:
                    arr.append("enlisted personnel training")
                # exclude string if there's already one in arr and either has trailing " skills"
                if not any( 
                    existing_str in {string + " skills", string.rstrip(" skills")}
                    for existing_str in arr
                ):  arr.append(string)

def process_element(xmlFile):
    # Process the current element
    jobs = []

    # Process children recursively
    for occupation in xmlFile:
        
        # Ignore tags not specified in the provided structure
        if occupation.tag == 'occupation':
            job = {}
            
            for child in occupation:
                if child.tag == 'title':
                    job['title'] = child.text
                
                if child.tag == 'description':
                    job['description'] = child.text

                elif child.tag == 'quick_facts':

                    for grandchild in child:
                        # get last value tag in grandchild
                        value_children = grandchild.find('value')

                        if grandchild.tag == 'qf_median_pay_annual' and has_text(value_children):
                            job['medianAnnual'] = float(value_children.text)
                        elif grandchild.tag == 'qf_median_pay_hourly' and has_text(value_children):
                            job['medianHourly'] = float(value_children.text)
                        elif grandchild.tag == 'qf_employment_outlook' and has_text(value_children):
                            job['jobGrowthPerc'] = float(value_children.text)
                        elif grandchild.tag == 'qf_employment_openings' and has_text(value_children):
                            job['jobGrowthNum'] = float(value_children.text)

                        elif grandchild.tag == 'qf_work_experience' and has_text(value_children):
                            # push unique fields for checkboxes
                            qfExpStr = value_children.text
                            pushUnique(qfExpStr, qfExpUnique)
                            job['reqWorkExp'] = qfExpStr
                        elif grandchild.tag == 'qf_entry_level_education' and has_text(value_children):
                            # push unique fields for checkboxes
                            qfEduStr = value_children.text
                            pushUnique(qfEduStr, qfEduUnique)
                            job['reqEdu'] = qfEduStr

                elif child.tag == 'work_environment':
                    grandchild = child.find('section_body')
                    job['hours'] = parse_cdata_regex(grandchild,
                                        r'(?s)<h3>Work Schedules</h3>.?<p>(.*?)</p>')
                    
                elif child.tag == 'how_to_become_one':
                    grandchild = child.find('section_body')
                    qfSkillsArr = parse_cdata_regex(grandchild,
                                            r'(?s)<strong><em>([^.]*)(?:\.)?</em>(?:\.)?</strong>')
                    # push unique fields for checkboxes
                    pushUnique(qfSkillsArr, qfSkillsUnique)
                    job['reqSkillset'] = qfSkillsArr

                # returns the contents of the first 'a href' hyperlink within the 'citation'
                elif child.tag == 'citation':
                    job['citation'] = parse_cdata_regex(child, r'(?s)<a\s+[^>]*href\s*=\s*[\'"]([^\'"]*)[\'"][^>]*>')  

            print(qfExpUnique + qfEduUnique + qfSkillsUnique)
            jobs.append(job)

    return jobs


if __name__ == '__main__':
    # Path to the external XML file
    xml_file_path = 'bls-ooh.xml'

    # Parse the XML file
    parsed_data = parse_xml(xml_file_path)

    # Connect to MongoDB Atlas
    client = MongoClient('connection str from .esv here')
    db = client.test

    if parsed_data is not None:
        # Push the parsed data to MongoDB
        db.jobs.insert_many(parsed_data)

    # push global vars to keywords database
    if qfSkillsUnique is not None and qfExpUnique is not None and qfEduUnique is not None:
        
        # sort each array's contents alphabetically
        qfSkillsUnique.sort()
        qfExpUnique.sort()
        qfEduUnique.sort()

        db.keywords.insert_one({
            "uniqueSkills": qfSkillsUnique, 
            "uniqueExp": qfExpUnique, 
            "uniqueEdu": qfEduUnique
        })
