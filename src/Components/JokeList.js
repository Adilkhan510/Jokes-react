import React, { Component } from 'react'
import axios from 'axios'
import uuid from 'uuid/v4'

import Joke from './Joke'

export default class JokeList extends Component {
    state = {
        jokes : JSON.parse(window.localStorage.getItem("jokes") || "[]"),
    }
    componentDidMount(){
        if(this.state.jokes.length===0){
            this.getJokes()
        }
    }

    getJokes= async ()=>{
        let jokes = [];
        while(jokes.length < 10){
            await axios.get('https://icanhazdadjoke.com/',{headers : {Accept : "application/json"}}).then(
                (response)=>{
                    let seenJokes = new Set(this.state.jokes.map(j=>j.joke));
                    let joke = response.data.joke;
                    if(!seenJokes.has(joke)){
                        console.log(seenJokes)
                        jokes.push({id : uuid(), joke: response.data.joke, votes : 0})}
                }).catch(error=>{
                console.log(error)
            })        
    } this.setState((st)=>({
        jokes : [...st.jokes,...jokes]
    }));
    window.localStorage.setItem('jokes', JSON.stringify(jokes))
}

    handleVote=async (id, delta)=>{
        await this.setState(st=>({
            jokes : st.jokes.map(
                j=> j.id === id ? {...j, votes : j.votes + delta} : j
            )
        }))
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    }

    render() {
        let jokes = this.state.jokes.sort((a,b)=> b.votes - a.votes)
        return (
            <div className="Jokelist">
                <div className="Jokelist-sidebar">
                    <h1 className="Jokelist-title"><span>Dad </span>Jokes</h1>
                    <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
                    <button onClick= {this.getJokes}>Get More Jokes</button>
                </div>
                <div className="Jokelist-Jokes">
                    {this.state.jokes.map(
                        (j) => {
                        return <Joke 
                        key = {j.id} 
                        text={j.joke} 
                        votes={j.votes} 
                        upvote={()=> this.handleVote(j.id, 1)} 
                        downvote = {()=>this.handleVote(j.id, -1)} />
                        }
                    )}
                </div>
            </div>
        )
    }
}
