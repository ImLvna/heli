/*
ADDITIONS:

- Added speeding up
- Added spacebar support

*/


async function start() {


    const config = {
        //Show current frame
        DEBUGVIEW: true,
        // Max velocity of the helicopter
        MAX_VELOCITY: 10,
        // Number of obstacles on the screen
        NUM_OBSTACLES: 5,
        // Dimensions of the obstacles
        OBS_DIMENSIONS: [40, 90],
        // Number of terrain pieces on the screen
        // The pieces stretch so that they fill the screen
        TERRAIN_PER_SCREEN: 50,

        BACKGROUND_COLOR: "#373b38",
        OBSTACLE_COLOR: "#6d7ec7"
    }

    let bkcolor = new Rectangle(getWidth(), getHeight());
    bkcolor.setColor(config.BACKGROUND_COLOR);
    add(bkcolor);


    // Helicopter Design
    const heli = new WebImage(ImageLibrary.Objects.helicopter);
    heli.setSize(50, 25);
    heli.setPosition(100, getHeight() / 2);
    add(heli);

    let velocity = 0;

    let score = 0;

    let toLeft = 0;

    let loopIndex = 0;

    let speed = 5;

    let clicking = false;

    let died = false;

    let obstacles = [];
    let terrain = [];

    let dust = [];

    let deathtext = new Text("You Died");
    deathtext.setPosition(getWidth() / 2 - deathtext.getWidth()/2, getHeight() / 2 - deathtext.getHeight()/2);
    deathtext.setColor(Color.red);

    let scoretext = new Text("Score: " + score);
    scoretext.setPosition(10, 50);
    scoretext.setColor(Color.white);

    let curframe;
    if (config.DEBUGVIEW) {
        curframe = new Text("Frame: " + loopIndex);
        curframe.setPosition(0, getHeight() - curframe.getHeight());
        curframe.setColor(Color.white);
        add(curframe);
    }


    function genObstacles() {
        obstacles.forEach(remove);
        obstacles = [];
        for (let i = 0; i < config.NUM_OBSTACLES; i++) {
            let obstacle = new Rectangle(config.OBS_DIMENSIONS[0], config.OBS_DIMENSIONS[1]);
            obstacle.setPosition(getWidth() + i * (getWidth()/config.NUM_OBSTACLES), Randomizer.nextInt(0, getHeight() - config.OBS_DIMENSIONS[1]));
            obstacle.setColor(config.OBSTACLE_COLOR);
            add(obstacle);
            obstacles.push(obstacle);
        }
    }

    function genTerrain() {
        terrain.forEach(remove);
        terrain = [];
        for (let i = 0; i < config.TERRAIN_PER_SCREEN; i++) {
            // Bottom of screen
            let terrainPiece = new Rectangle(getWidth() / config.TERRAIN_PER_SCREEN, Randomizer.nextInt(0, getHeight() / 10));
            terrainPiece.setPosition(i * (getWidth() / config.TERRAIN_PER_SCREEN), getHeight() - terrainPiece.getHeight());
            terrainPiece.setColor(config.OBSTACLE_COLOR);
            add(terrainPiece);
            terrain.push(terrainPiece);

            // Top of screen
            terrainPiece = new Rectangle(getWidth() / config.TERRAIN_PER_SCREEN, Randomizer.nextInt(0, getHeight() / 10));
            terrainPiece.setPosition(i * (getWidth() / config.TERRAIN_PER_SCREEN), 0);
            terrainPiece.setColor(config.OBSTACLE_COLOR);
            add(terrainPiece);
            terrain.push(terrainPiece);
        }
    }


    function die() {
        clearInterval(gameloop);
        add(deathtext);
        died = true;
    }

    function setup() {
        genTerrain();
        genObstacles();
        dust.forEach(remove);
        dust = [];
        loopIndex = 0;
        remove(scoretext)
        add(scoretext);
        if (config.DEBUGVIEW) {
            remove(curframe);
            add(curframe);
        }
        scoretext.setText("Score: " + score);

    }
    
    function game() {
        if (clicking) velocity -= 1;
        else velocity += 1;
        
        if (velocity > config.MAX_VELOCITY) velocity = config.MAX_VELOCITY;
        if (velocity < -config.MAX_VELOCITY) velocity = -config.MAX_VELOCITY;
       
        let touchingBottom = heli.getY() + velocity > getHeight() - heli.getHeight();
        let touchingTop = heli.getY() + velocity < 0;
        if (touchingBottom || touchingTop) return die();
        
        heli.move(0, velocity);

        let numToLeft = 0;
        obstacles.forEach(i=>{

            // Reset the obstacle with a new Y position if it goes off the screen
            if (i.getX() + i.getWidth() < 0) {
                i.setPosition(getWidth(), Randomizer.nextInt(0, getHeight() - config.OBS_DIMENSIONS[1]));
                toLeft --;
            }
            
            i.move(-speed, 0);

            // Check if the helicopter is touching the obstacle
            if (heli.getX() + heli.getWidth() > i.getX() && heli.getX() < i.getX() + i.getWidth()) {
                if (heli.getY() < i.getY() + i.getHeight() && heli.getY() + heli.getHeight() > i.getY()) {
                    return die();
                }
            }

            // Check if the helicopter has passed the obstacle
            if (heli.getX() > i.getX() + i.getWidth()) {
                numToLeft++;
            }
        });

        if (numToLeft > toLeft) {
            score++;
            toLeft = numToLeft;
            scoretext.setText("Score: " + score);
        }

        // let isHalf = false;
        terrain.forEach((i, index)=>{
            // if (index * 2 == terrain.length) isHalf = true;

            if (i.getX() + i.getWidth() < 0) {
                i.setPosition(getWidth(), i.getY())
            //     i.setSize(i.getWidth(), Randomizer.nextInt(0, getHeight() / 10));
            //     if (!isHalf) {
            //         i.setPosition(i.getX(), getHeight() - i.getHeight());
            //     }
            }
            i.move(-speed, 0);

            if (heli.getX() + heli.getWidth() > i.getX() && heli.getX() < i.getX() + i.getWidth()) {
                if (heli.getY() < i.getY() + i.getHeight() && heli.getY() + heli.getHeight() > i.getY()) {
                    return die();
                }
            }
        });

        dust.forEach(i=>{
            i.move(-speed, 0);
            if (i.getX() < 0) remove(i);

            i.setRadius(i.getRadius() - 0.1);
        });

        if (loopIndex % 2 == 0) {
            let dustParticle = new Circle(4);
            dustParticle.setPosition(heli.getX() + heli.getWidth() / 2, heli.getY() + heli.getHeight() / 2);
            dustParticle.setColor('#ccc');
            add(dustParticle);
            dust.push(dustParticle);
        }
        loopIndex++;

        if (config.DEBUGVIEW) curframe.setText("Frame: " + loopIndex);

        if (loopIndex % 200 == 0) {
            speed += 1;
            console.log("Speeding up to " + speed);
        }

    }
    
    setup();
    let gameloop = setInterval(()=>game(), 40);

    function onClick() {
        clicking = true;
        if (died) {
            died = false;
            remove(deathtext);
            velocity = 0;
            score = 0;
            toLeft = 0;
            speed = 5;
            heli.setPosition(100, getHeight() / 2);
            setup();
            gameloop = setInterval(() => game(), 40);
        }
    }

    mouseUpMethod(() => clicking = false);
    mouseDownMethod(onClick);

    // Spacebar
    keyDownMethod((e) => e.keyCode == 32 && onClick());
    keyUpMethod((e) => e.keyCode == 32 && (clicking = false));

}

/*Hi mr finelli, im developing this in vscode
instead of codehs editor. Because of how i have
the environment set up, i have to export the
start function. Codehs completely ignores this
line so you can too*/
export default start