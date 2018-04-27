import React, { Component } from 'react'
import styled from 'styled-components'

class App extends Component {
  componentDidMount () {
    //api stuff here
  }

  render () {
    return (
      <Container>
        <Wrapper>
          Hello world
        </Wrapper>
      </Container>
    )
  }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`

const Wrapper = styled.div`
  width: 1100px;
  margin: 0px auto;
`

export default App