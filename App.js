import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Image, Button } from 'react-native';
import Constants from "./Constants";
import {GameEngine} from "react-native-game-engine"
import Matter from "matter-js";
import Bird from "./Bird";
import Floor from "./Floor";
import Pyhsics, { resetPipes } from "./Pyhsics";
import Images from "./assets/Images";


export default class App extends React.Component {
  
  constructor(props){
    super(props);
    this.GameEngine = null;
    this.entities = this.setupWorld();

    this.state = {
      running: true,
      score: 0,
    
    }
  }




  setupWorld = () => {
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;
    world.gravity.y = 0.0;

    let bird = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2, Constants.BIRD_WIDTH, Constants.BIRD_HEIGHT );
   
    let floor1 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH / 2,
      Constants.MAX_HEIGHT-72, 
      Constants.MAX_WIDTH + 4, 
      50, 
      { isStatic: true }  
    );

    let floor2 = Matter.Bodies.rectangle(
      Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2),
      Constants.MAX_HEIGHT-72, 
      Constants.MAX_WIDTH + 4, 
      50, 
      { isStatic: true }  
    );
    



    Matter.World.add(world, [bird, floor1, floor2]);

    Matter.Events.on(engine, "collisionStart", (event) => {
      let pairs = event.pairs;

      this.GameEngine.dispatch({ type: "game-over" })
    });

    return {
      physics: {engine: engine, world: world},
      bird: { body: bird, renderer: Bird},
      floor1: { body: floor1, renderer: Floor },
      floor2: { body: floor2, pose: 1, renderer: Floor },
     
  }
}



  onEvent = (e) => {
    if ( e.type === "game-over"){
      this.setState({
        running: false
      });
    } else if (e.type == "score") {
      
        this.setState({
          score: this.state.score + 1

        })
    }
  }

  reset = () => {
    resetPipes();
    this.GameEngine.swap(this.setupWorld());
    this.setState({
      running: true,
      score: 0
    })
  }

  

  render() {
    
    
    return (
      <View style={styles.container}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch"/>
        <GameEngine
          ref={(ref) => {this.GameEngine = ref;}}
          style = {styles.gameContainer}
          systems = {[Pyhsics]}
          running = {this.state.running}
          onEvent = {this.onEvent}
          entities = {this.entities} >
          </GameEngine>
          <Text style={styles.score}>{this.state.score}</Text>
          {!this.state.running && <TouchableOpacity onPress={this.reset} style={styles.fullScreenButton}>
            <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
              <Text style={styles.gameOverSubText}>??omar u??amad?? l??tfen tekrar deneyin</Text>
            </View>
          </TouchableOpacity> }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT
  },
  gameContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  fullScreenButton: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },

  fullScreen: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "black",
    opacity: 0.8,
    justifyContent: "center",
    alignItems: "center"
  },
  gameOverText: {
    color: "white",
    fontSize: 48
  },

  gameOverSubText: {
      color: "white",
      fontSize: 16
    },
  score: {
    position: "absolute",
    color: "white",
    fontSize: 72,
    top: 50,
    left: Constants.MAX_WIDTH / 2 - 20,
    textShadowColor: "#444444",
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
    fontFamily: "04b_19"
  }


});














