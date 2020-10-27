import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import Button from '../components/Button';

const Container = styled.div`
  color: #777777;
  width: 100%;
  height: 100%;
  padding: 80px 16px;
`

const Header = styled.div`
  margin-bottom: 36px;
  h3 {
    font-size: 22px;
    line-height: 36px;
    font-weight: 700;
    margin: 0;
  }
  p {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    margin: 0;
    position: relative;
    top: -6px;
  }
`

const Content = styled.div`
  display: flex;
  div {
    width: 50%;
    p.text-muted {
      font-size: 16px;
      line-height: 26px
      font-weight: 400px;
    }
    p:not(.text-muted) {
      font-size: 24px;
      line-height: 24px;
      font-weight: 700px;
    }
  }
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
      currentShift: {
        id: null,
        start_time: null,
        end_time: null
      },
    };
  }

  componentDidMount() {
    this.fetchJob()
  }

  fetchJob() {
    console.log('fetch job...');
    const url = '/api/v1/users/1';
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        const { id, name, job, last_shift } = data
        this.setState({
          isLoaded: true,
          userId: id,
          userName: name,
          jobId: job.id,
          jobTitle: job.title,
          lastShift: last_shift || {},
          hasActiveShift: last_shift ? last_shift.end_time === null : false
        })

        console.log('current has active shift::', this.state.hasActiveShift);

        if (this.state.hasActiveShift) {
          this.setState({ currentShift: last_shift })
        }

        console.log('fetchjob::currentShift::', this.state.currentShift);
      })
  }

  clockIn = (e) => {
    e.preventDefault();
    const { userId, jobId } = this.state
    const url = '/api/v1/shifts';

    console.log('clocking in....');
    this.setState({ isLoaded: false });

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
        console.log(data);
        console.log('current has active shift::', this.state.hasActiveShift);
        this.setState({
          isLoaded: true,
          hasActiveShift: true,
          currentShift: data.shift
        })
        console.log('current has active shift::', this.state.hasActiveShift);
        console.log('clockin::currentShift::', this.state.currentShift);
      })
  }

  clockOut = (e) => {
    e.preventDefault();
    const shiftId = this.state.currentShift.id
    console.log(shiftId);
    // const { userId, jobId } = this.state
    const url = `/api/v1/shifts/${shiftId}`;

    console.log('clocking out....');

    fetch(url, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          currentShift: data.shift,
        })
        console.log('clockout::state::', this.state);
        console.log('clockout::currentShift::', this.state.currentShift);
        console.log('current has active shift::', this.state.hasActiveShift);
        // // console.log('state:::', this.state);
        // console.log(this.state.hasActiveShift);
        // this.setState({
        //   hasActiveShift: true,
        //   currentShift: {
        //     startTime: data.shift.start_time
        //   }
        // })
        // console.log(this.state.hasActiveShift);
        // this.setState({
        //   isLoaded: true,
        //   lastShift: data.shift,
        //   activeShift: true,
        //   currentShfit: {
        //     startTime: data.shift.start_time,
        //   }
        // })
      })
  }


  handleClick = (e) => {
    if (this.state.hasActiveShift) {
      this.clockOut(e);
    } else {
      this.clockIn(e);
    }
  }

  formatTime(time) {
    return time ? moment(time).format('h:mm a') : "-"
  }

  renderContent() {
    let startTime = this.formatTime(this.state.currentShift.start_time)
    let endTime =  this.formatTime(this.state.currentShift.end_time)
    // if (this.state.activeShift) {
      // startTime = this.lastShift.start_time
    // }
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

  render() {
    const { userName, jobTitle, jobId, lastShift } = this.state;
    return (
      <Container>
        <Header>
          <h3>{jobTitle}</h3>
          <p>{userName}</p>
        </Header>
        {this.renderContent()}
        <Button text="Clock in" onClick={this.handleClick} />
      </Container>
    );
  }
}

// static prop types and default props
