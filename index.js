async function start() {

    const MAX_VELOCITY = 10;

    const NUM_OBSTACLES = 5;

    const OBS_DIMENSIONS = [50, 100];

    let bkcolor = new Rectangle(getWidth(), getHeight());
    bkcolor.setColor(Color.blue);
    add(bkcolor);


    // Helicopter Design
    const heli = new WebImage(ImageLibrary.Objects.helicopter);
    heli.setSize(50, 25);
    heli.setPosition(100, getHeight() / 2);
    add(heli);

    let velocity = 0;

    let clicking = false;

    let died = false;

    let obstacles = [];


    let deathtext = new Text("You Died");
    deathtext.setPosition(getWidth() / 2 - deathtext.getWidth()/2, getHeight() / 2 - deathtext.getHeight()/2);
    deathtext.setColor(Color.red);


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

    function die() {
        clearInterval(gameloop);
        add(deathtext);
        died = true;
    }

    function setup() {
        genObstacles();
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

        obstacles.forEach(i=>{

            // Reset the obstacle with a new Y position if it goes off the screen
            if (i.getX() + i.getWidth() < 0) i.setPosition(getWidth(), Randomizer.nextInt(0, getHeight() - OBS_DIMENSIONS[1]));
            
            i.move(-5, 0);

            // Check if the helicopter is touching the obstacle
            if (heli.getX() + heli.getWidth() > i.getX() && heli.getX() < i.getX() + i.getWidth()) {
                if (heli.getY() < i.getY() + i.getHeight() && heli.getY() + heli.getHeight() > i.getY()) {
                    return die();
                }
            }
        });
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