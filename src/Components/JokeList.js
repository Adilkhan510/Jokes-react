import React, { Component } from 'react'
import axios from 'axios'

export default class JokeList extends Component {

    // need to get 10 jokes// 
    static defaultProps ={
        numJokesToGet : 10,
    }

    state = {
        jokes : [],
    }
    async componentDidMount(){
        let jokes = [];
        while(jokes.length < this.props.numJokesToGet){
            let res = await axios.get('https://icanhazdadjoke.com/',{headers : {Accept : "application/json"}})
            jokes.push(res.data.joke)
        }
        this.setState({
            jokes : jokes
        })
    }
    render() {
        return (
            <div className="Jokelist">
                <h1>Dad Jokes</h1>
                <div className="Jokelist-Jokes">
                    {this.state.jokes.map(
                        (j) => {
                        return <div>{j}</div>
                        }
                    )}
                </div>
            </div>
        )
    }
}
