var app = app || {};

var showStuff = function(){
        $('#content').show()
        $('#about').show().animate({opacity: 1}, 500, function(){
            $('nav').show('drop', 500);
        });   
    }

app.beans = function() {
    var bulletTime = 0;
    var collect = 0;
    var player;
    var skills;
    var ground;
    var beanFall;
    var emitter;
    var cursors;
    var cpuRun = false;
    var collectAll = false;
    var cpuTimer;
    var w = window.innerWidth;
    var icons = ['git', 'ruby', 'js', 'css', 'html'];
    var direction = "up";

    //my default was 200 to height
    var game = new Phaser.Game(w, 200, Phaser.CANVAS, 'bean', {
        preload: preload,
        create: create,
        update: update
    });


    function preload() {
        game.stage.backgroundColor = '#252044';
        game.load.image('particle', 'assets/images/particle.png');
        game.load.image('ground', 'assets/images/blackbg.png');
        game.load.image('ruby', 'assets/images/ruby-rails-128.png');
        game.load.image('js', 'assets/images/javascript-128.png');
        game.load.image('git', 'assets/images/github-128.png');
        game.load.image('css', 'assets/images/css-128.png');
        game.load.image('html', 'assets/images/html.png');
        game.load.spritesheet('me', 'assets/images/dude.png', 32, 48);

    }

    function create() {
        

        game.physics.startSystem(Phaser.Physics.ARCADE);
        player = game.add.sprite(game.world.width - 40, 0, 'me');
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        player.anchor.setTo(0.5, 0.5);
        player.inputEnabled = true;

        game.physics.arcade.enable(player);
        player.enableBody = true;

        player.body.collideWorldBounds = true;

        player.body.gravity.y = 1500;

        skills = game.add.group();
        skills.enableBody = true;

        emitter = game.add.emitter(0,0, 50);
        emitter.makeParticles('particle');
        emitter.gravity = -200;
        emitter.width = 30;
        emitter.height = 2;
        emitter.minParticleScale = 0.25;
        emitter.maxParticleScale = 0.5;


        //Kb input
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        

        //Cpu controlls character if no input after 4 seconds
        setTimeout(function() {
            cpuRun = true;
        }, 4000);

        createSkills();
    }


    function update() {
        player.body.velocity.x = 0;
        // game.physics.arcade.collide(player, ground);
        // game.physics.arcade.collide(skills, ground);

        if (cursors.left.isDown) {
            cpuOff();
            direction = "left";
            //  Move to the left
            player.body.velocity.x = -300;

            player.animations.play('left');
        } else if (cursors.right.isDown) {
            cpuOff();
            direction = "right";
            //  Move to the right
            player.body.velocity.x = 300;

            player.animations.play('right');
        } else if (!cpuRun) {
            //  Stand still
            direction = "up"
            player.animations.stop();
            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.blocked.down) {
            cpuOff();
            player.body.velocity.y = -400;
        }

        if (fireButton.isDown && collectAll) {
            fireSkill();
        }

        //CPU controlling character
        if (cpuRun) {
            cpuControll();
        }

        game.physics.arcade.collide(skills, skills)
        game.physics.arcade.overlap(player, skills, collectSkill, null, this)

    }


    function fireSkill() {
        //make sure have items to throw and rate of fire
        if (icons.length > 0 && game.time.now > bulletTime) {

            var velx = 0;
            var vely = 0;

            switch (direction) {
                case "up": //standing still
                    vely = 1000;
                    velx = 20;
                    break;
                case "left":
                    velx = -500;
                    break;

                case "right":
                    velx = 500;
                    break;

            }

            var projectile = icons.shift();
            var skill = skills.create(player.x - 15, player.y - 10, projectile);
            skill.scale.setTo(.2, .2);
            skill.body.gravity.y = 800;
            skill.body.velocity.x = velx;
            skill.body.velocity.y = vely;
            skill.body.bounce.y = 0.7 + Math.random() * 0.2;
            skill.body.collideWorldBounds = true;

            //need to stop velocities so they dont keep travelling
            setTimeout(function() {
                skill.body.velocity.x = 0;
                skill.body.velocity.y = 0;
            }, 2000);

            bulletTime = game.time.now + 400;
        }

    }

    function cpuOff() {
        if (cpuRun) {
            cpuRun = false;
        }
    }

    function cpuControll() {
            if (collect === 5 && !collectAll) {
                collectAll = true;
                player.animations.stop();
                player.frame = 4;
                
                    player.body.velocity.y = -400;
                
            } else if (collectAll) {
                player.body.velocity.x = 300;
                player.animations.play('right');
                if (player.x >= game.world.width / 2) {

                    cpuRun = false;
                    stageTwo();
                }
            } else {
                player.body.velocity.x = -300;
                player.animations.play('left');
            }

        }
        //initial drop down of skills
    function createSkills() {
        var w = window.innerWidth;
        var margin = (w - 900) / 2;
        var icons = ['git', 'ruby', 'js', 'css', 'html'];
        var drop = 700;
        var scale = 1;
        var size = 200

        if(w < 960){
            scale = 0.3;
            margin = 0;
            size = 50;
        };

        for (var i = 0; i < 5; i++) {

            var skill = skills.create((i * size) + margin, -100, icons[i]);
            skill.scale.setTo(scale);
            skill.body.gravity.y = drop;
            skill.body.bounce.y = 0.7 + Math.random() * 0.2;
            skill.body.collideWorldBounds = true;
        }

    }

    // Removes the skill from screen when run over
    function collectSkill(player, skill) {
        
        if (skill.body.velocity.x > -20 && skill.body.velocity.x < 20) {
            if (collectAll) {
                icons.push(skill.key)
            }

            if (skill.scale.x === 0.2) {
                collect += 1;
                skill.kill();
                particleBurst();
            }

            if (collect === 5) {
                if (!cpuRun) {
                    collectAll = true;
                    stageTwo();
                }
            }

            skill.scale.setTo(.2, .2);
        }
    }

    function particleBurst() {
        emitter.x = player.x;
        emitter.y = player.y;
        emitter.start(true, 700, null, 8);
    }


    function headingIn() {
        player.body.velocity.y = -400;
        $('#web').show().textillate({ in : {
                effect: 'bounceInLeft',
                sequence: true,
                callback: function() {
                    storyThree();
                }
            }
        });
    }

    function stageTwo() {
        $('#head .story:nth-of-type(1)').animate({
            opacity: 0
        }, 1000, function() {
            storyTwo();
        });
    }

    function storyTwo() {
        $('#head .story:nth-of-type(1)').remove();
        $('#head .story').show().textillate({ in : {
                effect: 'bounceIn',
                sequence: true,
                callback: function() {
                    headingIn();
                }
            }
        });
    }

    function storyThree() {
        $('#head .story').animate({
            opacity: 0
        }, 1000, function() {
            $('#head .story').html('Rodney Sue-San').animate({
                opacity: 1
            }, 1000, function() {
                showStuff();
            });
        });
    }

};

/////////////////////
//                 //
// page animations //
//                 //
//                 //
/////////////////////

var menuBlackBg = function(){
    $('nav').hide('blind', 500, function(){
        $('ul.nav li').css({"color": "white"});
        $('nav').css({"background": "#252044"}).show('drop', 500);
        $('#myMenu a').animate({"color": "white"}, 1000);
        $('#name').removeClass("nameDown").addClass("nameTop");
    });
}

var menuWhiteBg = function(){
        $('nav').hide().css({"background": "white"}).show(
            'blind', 500, function(){
                $('#myMenu a').css({"color": "black"});
                $('#name').removeClass("nameTop").addClass("nameDown");

            });
        
}

var pageDisplay = {
    dragon: function() {
            this.showP('#dragon p');
            this.showH('#dragon h3');
    },
    claw: function(){
            this.showP('#claw p');
            this.showH('#claw h3');
    },
    work: function(){
            this.showP('#work p');
            this.showH('#work h3');
    },
    fighter: function(){
            this.showP('#fighter p');
            this.showH('#fighter h3');
    },
    showP: function(page){
        $(page).show().textillate({ in : {
            effect: 'fadeInDown',
            sync: true,
            delay: 10
        }});
        
    },
    showH: function(head){
        $(head).animate({"opacity": "1"}, 1000);
    }
}

$(document).ready(function() {
    $('#head .story:nth-of-type(1)').textillate({ in : {
            effect: 'bounceIn',
            sequence: true
        }
    });

    $('#fullpage').fullpage({
        anchors: ['firstPage', 'secondPage', 'thirdPage'],
        // menu: '#myMenu',
        sectionSelector: '.mySection',
        keyboardScrolling: true,
        afterLoad: function(anchorLink, index){
            var loadedSection = $(this);
            // if(anchorLink) == 'firstPage'){

            // }
            //using anchorLink
            if(anchorLink == 'secondPage'){
                pageDisplay.work();
            }

            if(anchorLink == 'thirdPage'){
                pageDisplay.claw();
            }
            if(anchorLink == 'fourthPage'){
                pageDisplay.dragon();
            }
            if(anchorLink == 'fifthPage'){
                pageDisplay.fighter();
            }
        },
        onLeave: function(index, nextIndex, direction){
            var leavingSection = $(this);

            //after leaving section 2
            if(index == 1 && direction != 1){
                menuWhiteBg();
            }

            else if(index != 1 && nextIndex == 1){
                menuBlackBg();
            }

        }
    })

    app.beans();

});
