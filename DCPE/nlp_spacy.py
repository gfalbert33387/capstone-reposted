# nlp_spacy.py
import spacy
import sys
import json

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

# Function to parse text and extract entities
def parse_text(text):
    doc = nlp(text)
    return [ent.text for ent in doc.ents]

if __name__ == "__main__":
    input_text = sys.argv[1]
    entities = parse_text(input_text)
    print(json.dumps(entities))  # Serialize list to JSON and print it
