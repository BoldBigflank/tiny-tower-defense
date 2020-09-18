# Sculpting Done Quick

## Created by Alex Swan

[Play the game](https://alexswan.info/js13k-2020-sculpting-done-quick/index.html)

## For JS13KGames Game Jam 2020

http://js13kgames.com


## Post Mortem
BabylonJS wants:
I want to be able to grab an object in one hand, grab it in the other hand, then release the first hand without breaking everything
I want to be able to change the pointer ray to a collider sphere
I want to be able to grab and rotate an object along an axis
I want events to happen (turn on highlight) when a pointer ray is hitting an object
I want to make cool water/sky/rock shaders in NME (with proper noise generation)
I want to do Animations properly, both with the Animation class and registerBeforeRender
 - Is registerBeforeRender ok to use basically with each object for sinusoidal animations?
Is it cool to add properties and behaviors to meshes? It's basically Unity3d's style
