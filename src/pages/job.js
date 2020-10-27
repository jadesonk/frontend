import Job from '../components/Job'
import styled from 'styled-components'

const Container = styled.div`
  width: 400px;
  height: 600px;
`


export default function JobPage() {
  return (
    <Container>
      <Job />
    </Container>
  );
}
