window.LimitlessData ??= {}

window.LimitlessData.enquiryFields = {
  "first-name": {
    "label": "First Name",
    "required": true,
    "wide": false,
    "control": {
      "tag": "input",
      "attributes": {
        "autocomplete": "given-name",
        "type": "text"
      }
    }
  },
  "last-name": {
    "label": "Last Name",
    "required": true,
    "wide": false,
    "control": {
      "tag": "input",
      "attributes": {
        "autocomplete": "family-name",
        "type": "text"
      }
    }
  },
  "email": {
    "label": "Email",
    "required": true,
    "wide": false,
    "control": {
      "tag": "input",
      "attributes": {
        "autocomplete": "email",
        "type": "email"
      }
    }
  },
  "phone": {
    "label": "Phone Number (UK Only)",
    "required": true,
    "wide": false,
    "control": {
      "tag": "input",
      "attributes": {
        "autocomplete": "tel",
        "type": "tel"
      }
    }
  },
  "postcode": {
    "label": "Your Postcode",
    "required": false,
    "wide": true,
    "control": {
      "tag": "input",
      "attributes": {
        "autocomplete": "postal-code",
        "placeholder": "(Enter your postcode to help us find pickup points near you.)",
        "type": "text"
      }
    }
  },
  "destination": {
    "label": "Destination of Interest",
    "required": false,
    "wide": true,
    "control": {
      "tag": "select",
      "attributes": {},
      "options": [
        {
          "label": "(Select a destination or leave blank)",
          "value": "",
          "disabled": true,
          "selected": true
        },
        {
          "label": "Any destination"
        },
        {
          "label": "Anywhere in UK"
        },
        {
          "label": "England"
        },
        {
          "label": "Scotland"
        },
        {
          "label": "Wales"
        },
        {
          "label": "Anywhere in Europe"
        },
        {
          "label": "Spain"
        },
        {
          "label": "Italy"
        },
        {
          "label": "Anywhere in Cruise"
        }
      ]
    }
  },
  "notes": {
    "label": "Additional Notes",
    "required": false,
    "wide": true,
    "control": {
      "tag": "textarea",
      "attributes": {
        "placeholder": "E.g. Are you a wheelchair user? Do you receive care at home?",
        "rows": "4"
      }
    }
  }
}
