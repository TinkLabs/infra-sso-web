import React, { Component } from 'react'

import styles from './styles.less'

class CountrySelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showCountryOption: false,
      countryList: props.countryList,
      isChooseCity: false
    }
  }

  handleFocus = () => {
    this.setState({
      showCountryOption: true
    })
  }

  handleChange = e => {
    this.setState({
      isChooseCity: false
    })

    const inputValue = e.target.value
    this.props.onChange('country', inputValue)
    const filterCountryList = []
    this.props.countryList.forEach(item => {
      if (item.label.search(inputValue) !== -1) {
        filterCountryList.push(item)
      }
    })
    this.setState({
      countryList: filterCountryList
    })
  }

  handleBlur = () => {
    setTimeout(() => {
      this.hideCountryOption()
      if (!this.state.isChooseCity) {
        this.props.onChange('country', '')
        this.setState({
          countryList: this.props.countryList
        })
      }
    }, 100)
  }

  handleCityChose = countryValue => {
    // console.log(countryValue, 112)
    this.props.onChange('country', countryValue)
    this.setState({
      isChooseCity: true
    })
    this.hideCountryOption()
  }

  hideCountryOption = () => {
    this.setState({
      showCountryOption: false
    })
  }

  render() {
    const { append, prepend, error, placeholder, value, notFound } = this.props

    const { showCountryOption, countryList } = this.state

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {append && <div className={styles.append}>{append}</div>}
          <input
            className={styles.input}
            value={value}
            placeholder={placeholder}
            onChange={e => this.handleChange(e)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
          {prepend && <div className={styles.prepend}>{prepend}</div>}
          {showCountryOption ? (
            <ul className={styles.optionCont}>
              {countryList.length > 0 ? (
                countryList.map(country => (
                  <li
                    value={country.value}
                    key={country.value}
                    className={styles.optionItem}
                    onClick={() => this.handleCityChose(country.label)}
                  >
                    {country.label}
                  </li>
                ))
              ) : (
                <li className={styles.optionItem}>{notFound}</li>
              )}
            </ul>
          ) : null}
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {!error && <div className={styles.error}>&nbsp;</div>}
      </div>
    )
  }
}

export default CountrySelect
