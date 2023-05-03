async function start() {

    const MAX_VELOCITY = 10;

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

    let deathtext = new Text("You Died");
    deathtext.setPosition(getWidth() / 2 - deathtext.getWidth()/2, getHeight() / 2 - deathtext.getHeight()/2);
    deathtext.setColor(Color.red);

    function die() {
        clearInterval(gameloop);
        add(deathtext);
        died = true;
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
    }
    
    let gameloop = setInterval(() => game(), 40);


    mouseUpMethod(() => clicking = false);
    mouseDownMethod(() => {
        clicking = true;
        if (died) {
            died = false;
            remove(deathtext);
            velocity = 0;
            heli.setPosition(100, getHeight() / 2);
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