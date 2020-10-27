import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Button from '../components/Button';

const Container = styled.div`
  background-color: ${(props) => props.theme.whiteColor};
  color: ${(props) => props.theme.textColor};
  padding: 10rem 2rem;
  height: 100%;
  font-size: 2rem;
  font-weight: ${(props) => props.theme.font.bold};
  line-height: 3rem;
`

const Header = styled.div`
  margin-bottom: 4.5rem;
  h3 {
    font-size: 2.75rem;
    line-height: 4.5rem;
    margin: 0;
  }
  p {
    position: relative;
    top: -6px;
    margin: 0;
  }
`

const Content = styled.div`
  display: flex;
  margin-bottom: 4.5rem;
  div {
    width: 50%;
    p.text-muted {
      line-height: 3.25rem;
      font-weight: ${(props) => props.theme.font.regular};
      margin: 0 0 .5rem 0;
    }
    p:not(.text-muted) {
      font-size: 3rem;
      margin: 0;
    }
  }
`

const ErrorMessage = styled.p`
  margin: 1rem 0 0;
  font-weight: ${(props) => props.theme.font.regular};
  color: ${(props) => props.theme.redColor};
`

export default class Job extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasErrors: false,
      isLoaded: false,
      userId: null,
      userName: '',
      jobId: null,
      jobTitle: '',
      lastShift: {},
      hasActiveShift: false,
      currentShift: {},
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  fetchUser() {
    const url = '/api/v1/users/1';
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const { id, name, job, last_shift } = data
        this.setState({
          hasErrors: false,
          isLoaded: true,
          userId: id,
          userName: name,
          jobId: job.id,
          jobTitle: job.title,
          lastShift: last_shift || {},
          hasActiveShift: last_shift ? last_shift.end_time === null : false
        })
        if (this.state.hasActiveShift) this.setState({ currentShift: last_shift })
      });
  }

  clockIn = (e) => {
    e.preventDefault();
    const { userId, jobId } = this.state;
    const url = '/api/v1/shifts';
    const currentShift = this.state.currentShift;

    this.setState({
      isLoaded: false,
      currentShift: {}
    });

    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ shift: { user_id: userId, job_id: jobId } })
    })
      .then(response => response.json())
      .then((data) => {
        if (data.success === false) {
          this.setState({
            hasErrors: data.errors,
            isLoaded: true,
            currentShift: currentShift
          })
        } else {
          this.setState({
            hasErrors: false,
            isLoaded: true,
            hasActiveShift: true,
            currentShift: data.shift
          })
        }
      });
  }

  clockOut = (e) => {
    e.preventDefault();
    const shiftId = this.state.currentShift.id;
    const url = `/api/v1/shifts/${shiftId}`;

    this.setState({ isLoaded: false });

    fetch(url, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then((data) => {
        this.setState({
          hasErrors: false,
          isLoaded: true,
          hasActiveShift: false,
          currentShift: data.shift,
        })
      })
      .catch((err) => {
        this.setState({
          hasErrors: "An error occured. Please try again.",
          isLoaded: true,
        })
      })
  }

  formatTime(time) {
    return time ? moment(time).format('h:mm a') : false
  }

  renderContent() {
    const startTime = this.formatTime(this.state.currentShift.start_time) || "-"
    const endTime =  this.formatTime(this.state.currentShift.end_time) || "-"

    return (
      <Content>
        <div>
          <p className="text-muted">Clock in</p>
          <p>{startTime}</p>
        </div>
        <div>
          <p className="text-muted">Clock out</p>
          <p>{endTime}</p>
        </div>
      </Content>
    )
  }

  handleClick = (e) => {
    this.state.hasActiveShift ? this.clockOut(e) : this.clockIn(e);
  }

  render() {
    const { userName, jobTitle } = this.state;
    return (
      <Container>
        <Header>
          <h3>{jobTitle}</h3>
          <p>{userName}</p>
        </Header>
        { this.renderContent() }
        <Button
          activeShift={this.state.hasActiveShift}
          isLoaded={this.state.isLoaded}
          onClick={this.handleClick}
        />
        {this.state.hasErrors && <ErrorMessage>{this.state.hasErrors}</ErrorMessage>}
      </Container>
    );
  }
}
