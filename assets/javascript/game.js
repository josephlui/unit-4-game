
var elmo = {
    healthPoints : 130,
    attackPower: 20,
    numberOfAttacks: 0,
    counterAttackPower: 10,
    imagePath: "./assets/images/elmo.jpeg",
    index: 0,
    name: "elmo",
    displayName: "Elmo",
}

var ernie = {
    healthPoints : 140,
    attackPower: 10,
    numberOfAttacks: 0,
    counterAttackPower: 30,
    imagePath: "./assets/images/ernie.jpeg",
    index: 1,
    name: "ernie",
    displayName: "Ernie",
}

var bert = {
    healthPoints : 120,
    attackPower: 10,
    numberOfAttacks: 0,
    counterAttackPower: 15,
    imagePath: "./assets/images/bert.jpeg",
    index: 2,
    name: "bert",
    displayName: "Bert",
}

var oscar = {
    healthPoints : 120,
    attackPower: 10,
    numberOfAttacks: 0,
    counterAttackPower: 15,
    imagePath: "./assets/images/oscar.jpeg",
    index: 3,
    name: "oscar",
    displayName: "Oscar",
}

var availableCharacters = [elmo, ernie, bert, oscar];

var game = {
    currentCharacter: -1, 
    enemiesAvailableToAttack: [],
    defender: -1,
    numCharacter: 4,
    
    init: function(){
        this.currentCharacter = -1;
        this.enemiesAvailableToAttack = [0,1,2,3];
        this.defender = -1;
        $('#attack').on('click', function(){
           game.attack();
        });
        game.setListeners();
    },
    
    setCharacter: function(characterIndex, section){

        // sets the current character
        this.currentCharacter = characterIndex;

        // set the enemiesAvailableToAttack array list
        console.log ("character index" + characterIndex);
        
        var index = this.enemiesAvailableToAttack.indexOf(characterIndex);
        if (index > -1) {
            this.enemiesAvailableToAttack.splice(index, 1);
        }
        console.log ("in enemiesAvailableToAttack " + this.enemiesAvailableToAttack);
        this.renderAvailableCharacters();
        this.renderEnemiesAvailableToAttack();
        
    },

    setEnemyToAttack: function(characterIndex){
        // remove character from enemy
        defender = characterIndex;
        var index = this.enemiesAvailableToAttack.indexOf(characterIndex);
        if (index > -1) {
            this.enemiesAvailableToAttack.splice(index, 1);
        }
        this.renderEnemiesAvailableToAttack();
    },

    renderAvailableCharacters: function(){
       $('#availableCharacters').html(this.renderCharacter(this.currentCharacter,'characterContainer'));
    },

    renderCharacter: function(characterIndex, css){
        var selectedCharacter = availableCharacters[characterIndex];
       
        console.log (selectedCharacter);
       
        return '<div class="'+css+'">'+ selectedCharacter.displayName + 
            '<img src= "' + selectedCharacter.imagePath  + '" class="imageContainer" width="80px" height="80px" id="'
            + selectedCharacter.index +'"></img> <div class="healthPower">'+ selectedCharacter.healthPoints+'</div></div>';
        
    },
    renderEnemiesAvailableToAttack: function(){
        var charactersToDraw = [];
        $('#enemies').empty();
        // draw availble enemies to attack
        var enemy = "";
        for (var i = 0; i < this.enemiesAvailableToAttack.length; i++){
            enemy = availableCharacters[this.enemiesAvailableToAttack[i]];
            console.log("enemy is " + enemy.index);
            $(enemies).append(this.renderCharacter(this.enemiesAvailableToAttack[i],'enemyContainer'));
        }
       this.setListeners();
    },
    getCharacter: function(){
        return this.currentCharacter;
    },

    getEnemiesAvailableToAttack: function(){
        return this.enemiesAvailableToAttack;
    },

    setDefender: function (characterIndex, section){
        console.log ("defender indes" + characterIndex);
        this.defender = characterIndex;
        // remove the character from the enemiesAvailableToAttack
        var index = this.enemiesAvailableToAttack.indexOf(characterIndex);
        if (index > -1) {
            this.enemiesAvailableToAttack.splice(index, 1);
        }
        ;
        $(section).html (this.renderCharacter(characterIndex,'defenderContainer'));
        console.log ("Available to attack " + this.enemiesAvailableToAttack);
    },
    getContext: function (section, charIndex){
        if (section === "section_availableCharacter"){
            game.setCharacter(charIndex, '#character');
        }
        if (section == "section_enemies"){
            game.setEnemyToAttack (charIndex);
            game.setDefender(charIndex, '#defender' ); 
            $('#summary').empty();
        }
    },
    attack: function(){

        if (this.defender === -1  && this.enemiesAvailableToAttack.length>0){
            $('#summary').empty();
            var div = $(document.createElement('DIV'))
            div.text('please choose a defender to attack');
            div.attr('class', 'text');
            $('#summary').append(div);
        } else {
            availableCharacters[this.currentCharacter].numberOfAttacks++;

            availableCharacters[this.defender].healthPoints -= 
                availableCharacters[this.currentCharacter].attackPower
                    * availableCharacters[this.currentCharacter].numberOfAttacks;
    
            availableCharacters[this.currentCharacter].healthPoints -=
            availableCharacters[this.defender].counterAttackPower;
            
            console.log ('character' + availableCharacters[this.currentCharacter].healthPoints);
            console.log ('defender' + availableCharacters[this.defender].healthPoints);
    
            $('#defender').html (this.renderCharacter(this.defender,'defenderContainer'));
            $('#availableCharacters').html (this.renderCharacter(this.currentCharacter,'characterContainer'));
    
            $('#summary').html ('<div class="text"> You attacked ' + availableCharacters[this.defender].displayName + ' for '+availableCharacters[this.currentCharacter].attackPower
            * availableCharacters[this.currentCharacter].numberOfAttacks + ' damage</div>');
            $('#summary').append ('<div class="text">'+ availableCharacters[this.defender].displayName + ' attacked you back for ' + availableCharacters[this.defender].counterAttackPower + ' damage</div>');
    
            this.checkHealthPoints();
        }        
        
    },

    checkHealthPoints: function(){

      

        if (availableCharacters[this.currentCharacter].healthPoints < 0){
           // game over
           $('#attack').prop('disabled', true);
           $('#summary').html ('<div class="text">You have been defeated....GAME OVER!!!</div>'); 
           $('#reset').prop('disabled', false).show();
        }else if (this.enemiesAvailableToAttack.length === 0 &&
            availableCharacters[this.defender].healthPoints < 0){
            $('#attack').prop('disabled', true);
            $('#summary').html('<div class="text">you won!!!</div>');
            $('#reset').prop('disabled', false).show();
        }else if (availableCharacters[this.defender].healthPoints < 0){
            // remove character from the defender section
            $('#summary').html ('<div class="text">You have defected ' + availableCharacters[this.defender].displayName + ', you can choose to fight another seasme street character</div>'); 
            $('#defender').empty();
            this.defender = -1;
        }

        

    },
    setListeners: function(){
      
    $('.imageContainer').on('click', function(){
        $('#summary').empty();
        game.getContext(
            $(this).parent().parent().parent().attr('id'),
            parseInt($(this).attr('id')));
    }); 
    }
}

// event listeners

$( document ).ready(function(){
    
    $('#reset').prop('disabled', true).hide();
    $('#reset').on('click', function(){
        $('#reset').prop('disabled', true).hide();
        location.reload();
    });
    game.init();
   
});