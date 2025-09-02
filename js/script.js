function Play()
{
    window.location.href = "game.html";
}



document.addEventListener("DOMContentLoaded", () => {
    const field = new Field();
    //grid[4][2].style.backgroundColor = "green";
    
    let recordPoints = +document.getElementById("points-record").textContent;
    let nowPoints = +document.getElementById("points-now").textContent;
    
    console.log("recordPoints = " + recordPoints);
    console.log("nowPoints = " + nowPoints);
    
    
    
});

class Field {
    constructor(){
        this.size = 10;
        this.grid = [];
        this.gridField = document.querySelector(".grid-field");
        this.init();
    }
    
    init(){
        this.gridField.innerHTML = "";
        for (let x = 0; x < 10; x++)
        {
            grid[x] = [];
            for (let y = 0; y < 10; y++)
            {
                const cell = document.createElement("div");
                cell.dataset.x = x;
                cell.dataset.y = y;
                cell.classList.add("cell");
                gridField.appendChild(cell);
                
                grid[x][y] = cell;
            }
        }
    }
}

class Snake{
    constructor(field){
        this.field = field;
        this.body = [
            {x: 5, y: 5}
        ];
        
    }
    
    move(){
        
    }
    
    tail(){
        
    }
    
    increase(){
        
    }
    
    rip(){
        
    }
}

class Apple{

}


