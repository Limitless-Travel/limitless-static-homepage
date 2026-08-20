const homepageData = window.LimitlessData

if (!homepageData) {
  throw new Error("Homepage data must load before components.js")
}

function cloneTemplate(id) {
  const template = document.getElementById(id)

  if (!template) {
    throw new Error(`Missing template: #${id}`)
  }

  return template.content.cloneNode(true)
}

function findField(view, name) {
  const field = view.querySelector(`[data-field="${name}"]`)

  if (!field) {
    throw new Error(`Missing data field: ${name}`)
  }

  return field
}

function findList(view, name) {
  const list = view.querySelector(`[data-list="${name}"]`)

  if (!list) {
    throw new Error(`Missing data list: ${name}`)
  }

  return list
}

function setText(view, name, value) {
  findField(view, name).textContent = value || ""
}

function applyAttributes(element, attributes = {}) {
  Object.entries(attributes).forEach(([name, value]) => {
    if (value === false || value === null || value === undefined) {
      return
    }

    element.setAttribute(name, value === true ? "" : value)
  })
}

function getRecord(collection, key, element) {
  const record = homepageData[collection]?.[key]

  if (!record) {
    console.warn(`Missing ${collection} record: ${key}`)
    element.hidden = true
    return null
  }

  return record
}

function renderOptions(select, options = []) {
  options.forEach(optionData => {
    const view = cloneTemplate("form-option-template")
    const option = findField(view, "option")

    option.textContent = optionData.label
    applyAttributes(option, {
      value: optionData.value,
      disabled: optionData.disabled,
      selected: optionData.selected,
    })

    select.append(view)
  })
}

class HolidayCard extends HTMLElement {
  set data(value) {
    this.holiday = value

    if (this.isConnected) {
      this.render()
    }
  }

  connectedCallback() {
    if (this.holiday && !this.rendered) {
      this.render()
    }
  }

  render() {
    const view = cloneTemplate("holiday-card-template")
    const image = findField(view, "image")
    const eyebrow = findField(view, "eyebrow")
    const oldPrice = findField(view, "old-price")

    applyAttributes(image, this.holiday.image)
    setText(view, "title", this.holiday.title)
    setText(view, "description", this.holiday.description)
    setText(view, "price", this.holiday.price)
    setText(view, "days", this.holiday.days)

    eyebrow.textContent = this.holiday.eyebrow
    eyebrow.hidden = !this.holiday.eyebrow
    oldPrice.textContent = this.holiday.oldPrice
    oldPrice.hidden = !this.holiday.oldPrice

    const tags = findList(view, "tags")
    this.holiday.tags.forEach(tagData => {
      const tagView = cloneTemplate("holiday-tag-template")
      const tag = findField(tagView, "tag")

      tag.textContent = tagData.label
      if (tagData.variant) {
        tag.classList.add(`tag--${tagData.variant}`)
      }

      tags.append(tagView)
    })

    const departures = findList(view, "departures")
    this.holiday.departures.forEach(date => {
      const departureView = cloneTemplate("holiday-departure-template")
      findField(departureView, "departure").textContent = date
      departures.append(departureView)
    })

    this.replaceChildren(view)
    this.rendered = true
  }
}

class HolidayRow extends HTMLElement {
  connectedCallback() {
    if (this.rendered) {
      return
    }

    const row = getRecord("holidayRows", this.dataset.row, this)
    if (!row) return

    const view = cloneTemplate("holiday-row-template")
    setText(view, "title", row.title)
    setText(view, "action", row.actionLabel)

    const track = findList(view, "cards")
    row.holidays.forEach(holiday => {
      const card = document.createElement("holiday-card")
      card.data = holiday
      track.append(card)
    })

    this.replaceChildren(view)
    this.rendered = true
  }
}

class CategoryCard extends HTMLElement {
  set data(value) {
    this.category = value

    if (this.isConnected) {
      this.render()
    }
  }

  connectedCallback() {
    if (this.category && !this.rendered) {
      this.render()
    }
  }

  render() {
    const view = cloneTemplate("category-card-template")

    this.toggleAttribute("wide", this.category.wide)
    this.style.setProperty("--category-image", `url("${this.category.image}")`)
    setText(view, "title", this.category.title)
    setText(view, "description", this.category.description)

    this.replaceChildren(view)
    this.rendered = true
  }
}

class CategorySection extends HTMLElement {
  connectedCallback() {
    if (this.rendered) {
      return
    }

    const section = getRecord("categorySections", this.dataset.section, this)
    if (!section) return

    const view = cloneTemplate("category-section-template")
    const action = findField(view, "action")

    this.toggleAttribute("compact", section.compact)
    setText(view, "title", section.title)
    action.textContent = section.actionLabel
    action.hidden = !section.actionLabel

    const grid = findList(view, "cards")
    section.cards.forEach(category => {
      const card = document.createElement("category-card")
      card.data = category
      grid.append(card)
    })

    this.replaceChildren(view)
    this.rendered = true
  }
}

class TrustItem extends HTMLElement {
  connectedCallback() {
    if (this.rendered) {
      return
    }

    const item = getRecord("trustItems", this.dataset.item, this)
    if (!item) return

    const view = cloneTemplate("trust-item-template")
    applyAttributes(findField(view, "image"), item.image)
    setText(view, "title", item.title)
    setText(view, "description", item.description)

    this.replaceChildren(view)
    this.rendered = true
  }
}

class SearchField extends HTMLElement {
  connectedCallback() {
    if (this.rendered) {
      return
    }

    const field = getRecord(
      "searchFields",
      this.dataset.searchField,
      this,
    )
    if (!field) return

    const view = cloneTemplate("search-field-template")
    setText(view, "label", field.label)
    renderOptions(findField(view, "control"), field.options)

    this.replaceChildren(view)
    this.rendered = true
  }
}

class EnquiryField extends HTMLElement {
  connectedCallback() {
    if (this.rendered) {
      return
    }

    const field = getRecord(
      "enquiryFields",
      this.dataset.enquiryField,
      this,
    )
    if (!field) return

    const view = cloneTemplate("enquiry-field-template")
    const controlView = cloneTemplate(`form-${field.control.tag}-template`)
    const control = findField(controlView, "control")

    this.toggleAttribute("required", field.required)
    this.toggleAttribute("wide", field.wide)
    setText(view, "label", field.label)
    applyAttributes(control, field.control.attributes)

    if (field.control.tag === "select") {
      renderOptions(control, field.control.options)
    }

    findList(view, "control").replaceWith(controlView)
    this.replaceChildren(view)
    this.rendered = true
  }
}

class SplitSection extends HTMLElement {
  connectedCallback() {
    if (this.rendered) {
      return
    }

    const section = getRecord("splitSections", this.dataset.section, this)
    if (!section) return

    const view = cloneTemplate("split-section-template")
    const action = findField(view, "action")

    this.toggleAttribute("reverse", section.reverse)
    applyAttributes(findField(view, "image"), section.image)
    setText(view, "title", section.title)
    setText(view, "description", section.description)
    action.textContent = section.action.label
    action.classList.add(...section.action.classes)

    this.replaceChildren(view)
    this.rendered = true
  }
}

class FooterLinkGroup extends HTMLElement {
  connectedCallback() {
    if (this.rendered) {
      return
    }

    const group = getRecord("footerLinkGroups", this.dataset.group, this)
    if (!group) return

    const view = cloneTemplate("footer-link-group-template")
    const navigation = findField(view, "navigation")
    const title = findField(view, "title")
    const titleId = `footer-group-title-${this.dataset.group}`

    this.setAttribute("aria-label", group.label)
    title.id = titleId
    title.textContent = group.title
    navigation.setAttribute("aria-labelledby", titleId)

    const links = findList(view, "links")
    group.links.forEach(label => {
      const linkView = cloneTemplate("footer-link-template")
      findField(linkView, "link").textContent = label
      links.append(linkView)
    })

    this.replaceChildren(view)
    this.rendered = true
  }
}

customElements.define("holiday-card", HolidayCard)
customElements.define("holiday-row", HolidayRow)
customElements.define("category-card", CategoryCard)
customElements.define("category-section", CategorySection)
customElements.define("trust-item", TrustItem)
customElements.define("search-field", SearchField)
customElements.define("enquiry-field", EnquiryField)
customElements.define("split-section", SplitSection)
customElements.define("footer-link-group", FooterLinkGroup)
