function Play()
{
    window.location.href = "game.html";
}



document.addEventListener("DOMContentLoaded", () => {

    const recordElement = document.getElementById("points-record");
    let recordPoints = +recordElement.textContent;

    let saveRecordPoints = localStorage.getItem("recordPoints");

    if (saveRecordPoints) {
        recordElement.textContent = saveRecordPoints;
        recordPoints = +saveRecordPoints;
    }

    const field = new Field();
    const apple = new Apple(field);
    const snake = new Snake(field, apple, +recordElement.textContent);

    apple.setSnake(snake);

    document.addEventListener("keydown", (event) => {
        switch(event.key){
            case "ArrowUp":
            case "w":
            case "W":
            case "ц":
            case "Ц":
                snake.directionMove("top");
                break;
            case "ArrowRight":
            case "d":
            case "D":
            case "в":
            case "В":
                snake.directionMove("right");
                break;
            case "ArrowDown":
            case "s":
            case "S":
            case "ы":
            case "Ы":
                snake.directionMove("bottom");
                break;
            case "ArrowLeft":
            case "a":
            case "A":
            case "ф":
            case "Ф":
                snake.directionMove("left");
                break;
        }
    });

    apple.generateApple();
    snake.start();
    
    let nowPoints = +document.getElementById("points-now").textContent;
    
    console.log("recordPoints = " + recordPoints);
    console.log("nowPoints = " + nowPoints);
    
    
    
});

class Field {
    #size;
    #grid;
    #gridField;

    constructor(){
        this.#size = 10;
        this.#grid = [];
        this.#gridField = document.querySelector(".grid-field");
        this.#init();
    }
    
    #init(){
        this.#gridField.innerHTML = "";
        
        for (let x = 0; x < this.#size; x++)
        {
            this.#grid[x] = [];
            for (let y = 0; y < this.#size; y++)
            {
                const cell = document.createElement("div");
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.classList.add("cell");
                this.#gridField.appendChild(cell);
                
                this.#grid[x][y] = cell;
            }
        }
    }

    get size() {
        return this.#size;
    }

    get grid() {
        return this.#grid;
    }
}

class Snake{
    #field;
    #apple;
    #body;
    #head;
    #direction;
    #moveInterval;
    #nowPoints;
    #recordPoints;
    #speed;

    constructor(field, apple, recordPoints){
        this.#field = field;
        this.#apple = apple;
        this.#body = [
            {x: 5, y: 5},
            {x: 6, y: 5}
        ];
        this.#head = {...this.#body[0]};
        this.#direction = "top";
        this.#nowPoints = +document.getElementById("points-now").textContent;
        this.#recordPoints = recordPoints;
        this.#speed = 500;
    }
    
    directionMove(arrow) {
        if (this.#direction == "top" && arrow != "bottom" ||
            this.#direction == "bottom" && arrow != "top" ||
            this.#direction == "left" && arrow != "right" ||
            this.#direction == "right" && arrow != "left"
        )
            this.#direction = arrow;
    }

    start() {
        this.#visualSnake();
        this.#moveInterval = setInterval(() => this.#move(), this.#speed);
    }

    

    #move(){
        const newHead = {...this.#head};
        if (this.#direction == "top")
        {
            if (newHead.x > 0)
                newHead.x--;
            else
                newHead.x = 9;
        }
        else if (this.#direction == "right")
        {
            if (newHead.y < 9)
                newHead.y++;
            else
                newHead.y = 0;
        }
        else if (this.#direction == "bottom")
        {
            if (newHead.x < 9)
                newHead.x++;
            else
                newHead.x = 0;
        }
        else if (this.#direction == "left")
        {
            if (newHead.y > 0)
                newHead.y--;
            else
                newHead.y = 9;
        }

        this.#head = newHead;


        this.#body.unshift(this.#head);

        if (this.#body[0].x == this.#apple.coord.x &&
            this.#body[0].y == this.#apple.coord.y 
        )
            this.#eatApple();
        else
            this.#body.pop();

        if (this.#checkTile()) {
            this.#gameOver();
            return;
        }

        this.#visualSnake();
    }
    
    #visualSnake() {
        this.#clearField();
        this.#body.forEach((segment, index) => {
            if (index == 0)
            {
                this.#field.grid[segment.x][segment.y].style.backgroundColor = "darkgreen";
            }
            else
            {
                this.#field.grid[segment.x][segment.y].style.backgroundColor = "green";
            }
            
        });

        this.#apple.visualApple();
    }

    #clearField(){
        for (let i = 0; i < this.#field.size; i++)
        {
            for (let j = 0; j < this.#field.size; j++)
            {
                this.#field.grid[i][j].style.backgroundColor = "";
            }
        }
    }

    #eatApple(){
        if (this.#body[0].x == this.#apple.coord.x &&
            this.#body[0].y == this.#apple.coord.y 
        )
        {
            console.log("Съедено");
            this.#nowPoints++;
            document.getElementById("points-now").textContent = this.#nowPoints;

            this.#speed = Math.max(200, this.#speed - 10);
            clearInterval(this.#moveInterval);
            this.#moveInterval = setInterval(() => this.#move(), this.#speed);

            this.#apple.clearApple();
            this.#apple.generateApple();
        }
    }

    #checkTile(){
        const head = this.#body[0];

        for (let i = 1; i < this.#body.length; i++) {
            if (head.x === this.#body[i].x && head.y === this.#body[i].y) {
                return true;
            }
        }
        return false;
    }

    #gameOver() {
        if (this.#nowPoints > this.#recordPoints)
        {
            this.#recordPoints = this.#nowPoints
            localStorage.setItem("recordPoints", this.#recordPoints);
        }

        document.getElementById("recordGameOver").textContent = this.#nowPoints;

        const gameOver = document.getElementById("game-over");
        gameOver.style.display = "flex";

        clearInterval(this.#moveInterval);

        let buttonReplay = document.getElementById("replay");
        buttonReplay.onclick = () => {
            gameOver.style.display = "none";
            location.reload();
        }
    }

    getBody() {
        return [...this.#body];
    }
}

class Apple{
    #field;
    #snake;
    #coord;

    constructor(field, snake){
        this.#field = field;
        this.#snake = snake;
    }

    setSnake(snake) {
        this.#snake = snake;
    }

    get coord() {
        return this.#coord;
    }

    generateApple(){
        let isOnSnake = true;

        while (isOnSnake)
        {
            this.#coord = {x: 0, y: 0};
            this.#coord.x = Math.floor(10 * Math.random());
            this.#coord.y = Math.floor(10 * Math.random());

            isOnSnake = this.#snake.getBody().some(segment => 
                segment.x == this.#coord.x && segment.y == this.#coord.y
            );
        }

        this.visualApple();
    }

    visualApple(){
        const cell = this.#field.grid[this.#coord.x][this.#coord.y];
        cell.style.backgroundColor = "";

        let appleElement = cell.querySelector(".apple");
        if (!appleElement) 
        {
            appleElement = document.createElement("div");
            appleElement.classList.add("apple");
            cell.appendChild(appleElement);
        }

        appleElement.style.width = "80%";
        appleElement.style.height = "80%";
        appleElement.style.borderRadius = "50%";
        appleElement.style.backgroundColor = "red";
        appleElement.style.position = "absolute";
        appleElement.style.top = "10%";
        appleElement.style.left = "10%";
    }

    clearApple(){
        const cell = this.#field.grid[this.#coord.x][this.#coord.y];
        const appleElement = cell.querySelector(".apple");
        if (appleElement) 
        {
            appleElement.remove();
        }
    }
}


