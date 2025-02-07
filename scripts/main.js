/*
    Program: DFS and BFS Traversal
    Name:    Lucus Mulhorn
    Date:    11/7/2024
    Purpose: Demonstrate 2d maze traversal using DFS and BFS. The user may enter the dimensions of the maze they would like to create, and a random maze along with a start and end 
             point will be generated. The program will then find use DFS and BFS to traverse the maze and find a start and end point, and show them both to the user.
*/

// generate random integer
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//copy maze
function copyMaze(maze) {
    return maze.map(row => [...row]);
}

// check if position is valid (not visited/not a wall)
function isValid(maze, visited, x, y) {
    return (
        x >= 0 && y >= 0 &&
        x < maze[0].length && y < maze.length &&
        maze[y][x] !== "█" &&
        !visited.has(`${x},${y}`)
    );
}

//find path using either dfs or bfs
function findPath(maze, start, end, useBFS) {
    // determine wheter to use a queue or a stack based on useBFS boolean
    const dataStructure = useBFS ? new Queue() : new Stack();
    const visited = new Set();
    const parentMap = {}; // To keep track of the path

    // initialize queue/stack
    // use either dequeue or pop
    useBFS ? dataStructure.enqueue(start) : dataStructure.push(start);
    
    //mark starting pos as visited
    visited.add(`${start.x},${start.y}`);

    while (!dataStructure.isEmpty()) {
        // use either dequeue or pop
        const { x, y } = useBFS ? dataStructure.dequeue() : dataStructure.pop();

        // backtrack path to end if end is reached
        if (x === end.x && y === end.y) {
            return reconstructPath(parentMap, start, end);
        }

        // explore all 4 directions
        for (let [dx, dy] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
            //update position
            const newX = x + dx;
            const newY = y + dy;

            // check if the new position is valid (not wall and not visited)
            if (isValid(maze, visited, newX, newY)) {
                useBFS ? dataStructure.enqueue({ x: newX, y: newY }) : dataStructure.push({ x: newX, y: newY }); //enqueue/push new position
                visited.add(`${newX},${newY}`); //mark as visited

                if(!(newX === end.x && newY === end.y)){
                    maze[newY][newX] = directionSymbol(dx, dy); //update maze with direction symbol
                }

                parentMap[`${newX},${newY}`] = { x, y }; //track the current position's parent for backtracking
            }
        }
    }

    return null; // if no path is found
}

// backtrack path
function reconstructPath(parentMap, start, end) {
    const path = [];
    let current = end;

    while (current.x !== start.x || current.y !== start.y) {
        path.push(current);
        current = parentMap[`${current.x},${current.y}`];
    }

    path.push(start);
    return path; // return the path in the correct order
}

// Helper function to determine direction symbol based on movement
function directionSymbol(dx, dy) {
    if (dx === 0 && dy === 1) return "d";  // Down
    if (dx === 1 && dy === 0) return "r";  // Right
    if (dx === 0 && dy === -1) return "u"; // Up
    if (dx === -1 && dy === 0) return "l"; // Left
    return "░"; // Default (no movement)
}

//print maze to console
function printMaze(maze){
    for(let y = 0; y < height; y++){
        let string = "";
        for(let x = 0; x < width; x++){
            string += maze[y][x];
        }
        console.log(string);
    }    
}


//generate a maze
function generateMaze(height, width){
    let maze = new Array(height, width);

    for(let y = 0; y < height; y++){
        maze[y] = new Array(width);
        for(let x = 0; x < width; x++){
            //outer walls
            if(y == 0 || y == (height-1) || x == 0 || x == (width-1)){
                maze[y][x] = "█";
            }
            //place either obstacle or blank space in each cell
            else{
                if(Math.random() < 0.75){
                    maze[y][x] = " ";
                }
                else{
                    maze[y][x] = "█";
                }
            }
        }
    }
    return maze;
}

//create a new maze from user's input
function newMaze(){
    let height = document.getElementById('height').value;
    let width = document.getElementById('width').value;

    //check for invalid inputs
    if(height === "" || width === "" ||
       height < 3 || width < 3 ||
       height > 150 || width > 150)
    {
        window.alert("Please enter a valid number.");
        return;
    }

    //change canvas size
    canvasd.height = (height * 16 + 8) * gfxScaleFactor;
    canvasb.height = (height * 16 + 8) * gfxScaleFactor;
    canvasd.width = width * 16 * gfxScaleFactor;
    canvasb.width = width * 16 * gfxScaleFactor; 
    
    //clear existing canvas
    ctx[0].clearRect(0, 0, canvasd.width, canvasd.height);
    ctx[1].clearRect(0, 0, canvasb.width, canvasb.height);

    //disable image smoothing
    ctx[0].imageSmoothingEnabled = false;
    ctx[1].imageSmoothingEnabled = false;   

    //create new maze
    let maze = generateMaze(height, width);

    //start and end positions
    let startPos = {
        x: randomInt(1, width-2),
        y: randomInt(1, height-2)
    }
    
    let endPos = {
        x: randomInt(1, width-2),
        y: randomInt(1, height-2)
    }
    
    //set start and end positions
    maze[startPos.y][startPos.x] = "S";
    maze[endPos.y][endPos.x] = "E";
    
    //generate a dfs/bfs path
    function pathChoose(maze, path, c, cindx){
        if (!path) {
            window.alert("could not find path using " + c.toUpperCase() +"FS");
            path = null;
        }
        
        //draw the maze to the canvas
        drawMaze(maze, path, c, cindx);
    }
    
    //mark maze with dfs path finding
    let dfsStepMarkedMaze = copyMaze(maze);
    let dfsPath = findPath(dfsStepMarkedMaze, startPos, endPos, 0);
    
    //mark maze with bfs path finding
    let bfsStepMarkedMaze = copyMaze(maze);
    let bfsPath = findPath(bfsStepMarkedMaze, startPos, endPos, 1);
    
    //bfs and dfs
    pathChoose(dfsStepMarkedMaze, dfsPath, "d", 0);
    pathChoose(bfsStepMarkedMaze, bfsPath, "b", 1);
}

//generate inital maze
newMaze();

//set canvas container size
document.getElementById("dcvscontainer").style.maxHeight = canvasd.height + 18 + "px";
document.getElementById("dcvscontainer").style.maxWidth = canvasd.width + 20 + "px";

document.getElementById("bcvscontainer").style.maxHeight = canvasb.height + 18 + "px";
document.getElementById("bcvscontainer").style.maxWidth = canvasb.width + 20 + "px";