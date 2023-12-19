document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault()
  // Here you'd normally send this data to your backend for validation & authentication.
  console.log('User tried to login with username:', e.target.username.value, 'and password:', e.target.password.value)
})

/* function savePreferences () {
  const saveToProfile = document.getElementById('saveToProfile').checked
  const saveToDevice = document.getElementById('saveToDevice').checked

  if (saveToProfile) {
    console.log('Saving preferences to user profile...')
    // Code to save preferences to user profile goes here
  }

  if (saveToDevice) {
    console.log('Saving preferences to device...')
    // Code to save preferences to device, possibly using LocalStorage or IndexedDB, goes here
  }
} */


