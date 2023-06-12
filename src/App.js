import './App.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatus = {
  progress: 'progress',
  success: 'success',
  failure: 'failure',
  initial: 'initial',
}

// Replace your code here
class App extends Component {
  state = {
    activeOption: 'ALL',
    projectList: [],
    apiStatusValue: apiStatus.initial,
  }

  componentDidMount() {
    this.getFetchedData()
  }

  onSuccess = () => {
    const {projectList} = this.state

    return (
      <>
        {projectList.map(card => (
          <li className="project-card" key={card.id}>
            <img src={card.imageUrl} alt={card.name} className="card-image" />
            <p className="card-heading">{card.name}</p>
          </li>
        ))}
      </>
    )
  }

  getData = () => {
    this.getFetchedData()
  }

  onFailure = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="ima"
        alt="failure view"
      />
      <h1 className="header">Oops! Something Went Wrong</h1>
      <p className="para">
        We cannot seem to find the page you are looking for
      </p>
      <button className="but" type="button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onChangeActiveOption = event => {
    this.setState({activeOption: event.target.value}, this.getFetchedData)
  }

  getFetchedData = async () => {
    this.setState({apiStatusValue: apiStatus.progress})
    const {activeOption} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatusValue: apiStatus.success,
      })
    } else {
      this.setState({apiStatusValue: apiStatus.failure})
    }
  }

  getApiStatus = () => {
    const {apiStatusValue} = this.state

    switch (apiStatusValue) {
      case apiStatus.success:
        return this.onSuccess()

      case apiStatus.failure:
        return this.onFailure()

      case apiStatus.progress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeOption, projectList} = this.state
    console.log(projectList)
    return (
      <>
        <nav className="nav-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="logo"
            alt="website logo"
          />
        </nav>
        <div className="option">
          <select
            value={activeOption}
            onChange={this.onChangeActiveOption}
            className="option-container"
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </div>
        <ul className="project-list-container">{this.getApiStatus()}</ul>
      </>
    )
  }
}

export default App
