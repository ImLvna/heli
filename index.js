async function start() {

    const MAX_VELOCITY = 10;

    const NUM_OBSTACLES = 5;

    const OBS_DIMENSIONS = [50, 100];

    const TERRAIN_PER_SCREEN = 30;

    let bkcolor = new Rectangle(getWidth(), getHeight());
    bkcolor.setColor(Color.blue);
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


    function genObstacles() {
        obstacles.forEach(remove);
        obstacles = [];
        for (let i = 0; i < NUM_OBSTACLES; i++) {
            let obstacle = new Rectangle(OBS_DIMENSIONS[0], OBS_DIMENSIONS[1]);
            obstacle.setPosition(getWidth() + i * (getWidth()/NUM_OBSTACLES), Randomizer.nextInt(0, getHeight() - OBS_DIMENSIONS[1]));
            obstacle.setColor(Color.green);
            add(obstacle);
            obstacles.push(obstacle);
        }
    }

    function genTerrain() {
        terrain.forEach(remove);
        terrain = [];
        for (let i = 0; i < TERRAIN_PER_SCREEN; i++) {
            // Bottom of screen
            let terrainPiece = new Rectangle(getWidth() / TERRAIN_PER_SCREEN, Randomizer.nextInt(0, getHeight() / 10));
            terrainPiece.setPosition(i * (getWidth() / TERRAIN_PER_SCREEN), getHeight() - terrainPiece.getHeight());
            terrainPiece.setColor(Color.green);
            add(terrainPiece);
            terrain.push(terrainPiece);

            // Top of screen
            terrainPiece = new Rectangle(getWidth() / TERRAIN_PER_SCREEN, Randomizer.nextInt(0, getHeight() / 10));
            terrainPiece.setPosition(i * (getWidth() / TERRAIN_PER_SCREEN), 0);
            terrainPiece.setColor(Color.green);
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
        scoretext.setText("Score: " + score);

    }
    
    function game() {
        if (clicking) velocity -= 1;
        else velocity += 1;
        
        if (velocity > MAX_VELOCITY) velocity = MAX_VELOCITY;
        if (velocity < -MAX_VELOCITY) velocity = -MAX_VELOCITY;
       
        let touchingBottom = heli.getY() + velocity > getHeight() - heli.getHeight();
        let touchingTop = heli.getY() + velocity < 0;
        if (touchingBottom || touchingTop) return die();
        
        heli.move(0, velocity);

        let numToLeft = 0;
        obstacles.forEach(i=>{

            // Reset the obstacle with a new Y position if it goes off the screen
            if (i.getX() + i.getWidth() < 0) {
                i.setPosition(getWidth(), Randomizer.nextInt(0, getHeight() - OBS_DIMENSIONS[1]));
                toLeft --;
            }
            
            i.move(-5, 0);

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
            i.move(-5, 0);

            if (heli.getX() + heli.getWidth() > i.getX() && heli.getX() < i.getX() + i.getWidth()) {
                if (heli.getY() < i.getY() + i.getHeight() && heli.getY() + heli.getHeight() > i.getY()) {
                    return die();
                }
            }
        });

        dust.forEach(i=>{
            i.move(-5, 0);
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
    }
    
    setup();
    let gameloop = setInterval(() => game(), 40);


    mouseUpMethod(() => clicking = false);
    mouseDownMethod(() => {
        clicking = true;
        if (died) {
            died = false;
            remove(deathtext);
            velocity = 0;
            score = 0;
            toLeft = 0;
            heli.setPosition(100, getHeight() / 2);
            setup();
            gameloop = setInterval(() => game(), 40);
        }
    })
}


/*Hi mr finelli, im developing this in vscode
instead of codehs editor. Because of how i have
the environment set up, i have to export the
start function. Codehs completely ignores this
line so you can too*/
export default start