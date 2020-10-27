import Job from '../components/Job'
import styled from 'styled-components'

const Container = styled.div`
  width: 375px;
`


export default function JobPage() {
  return (
    <Container>
      <Job />
    </Container>
  );
}
