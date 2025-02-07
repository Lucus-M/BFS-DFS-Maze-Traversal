/*
    Program: DFS and BFS Traversal
    Name:    Lucus Mulhorn
    Date:    11/7/2024
    Purpose: Demonstrate 2d maze traversal using DFS and BFS.
*/

//dfs and bfs canvases
let canvasd = document.getElementById("canvasd");
let canvasb = document.getElementById("canvasb");

let ctx = [canvasd.getContext("2d"), canvasb.getContext("2d")];

//pixel scale factor
let gfxScaleFactor = 2;

//disable image smoothing
ctx[0].imageSmoothingEnabled = false;
ctx[1].imageSmoothingEnabled = false;

//draw the maze 
//maze = maze to be drawn
//path = final path followed with dfs/bfs
//c    = "d" or "b" character to use for file selection
//cindx= whether to use dfs or bfs canvas
function drawMaze(maze, path, c, cindx) {
    //loop through maze array
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            //determine graphic to use for tile
            let tileGfx = new Image();
            tileGfx.src = " ";

            switch (maze[y][x]) {
                case "█":
                    tileGfx.src = "graphics/bricks.png";
                    break;
                case "S":
                    tileGfx.src = "graphics/sflag.png";
                    break;
                case "E":
                    tileGfx.src = "graphics/fflag.png";
                    break;
                case "u":
                    tileGfx.src = "graphics/ufootsteps.png";
                    break;
                case "d":
                    tileGfx.src = "graphics/dfootsteps.png";
                    break;
                case "l":
                    tileGfx.src = "graphics/lfootsteps.png";
                    break;
                case "r":
                    tileGfx.src = "graphics/rfootsteps.png";
                    break;
                default:
                    tileGfx.src = " ";
                    break;
            }

            //draw each tile
            tileGfx.onload = function () {
                if (tileGfx.src !== " ") {
                    ctx[cindx].drawImage(tileGfx, 16 * x * gfxScaleFactor, ((16 * y) + 8) * gfxScaleFactor, 16 * gfxScaleFactor, 16 * gfxScaleFactor);
                }
            };
        }
    }

    //draw final dfs/bfs path
    if (path != null) {
        drawPath(path, c, cindx);
    }

    //draw label at top
    let label = new Image();
    label.src = "graphics/" + c + "fs.png";

    label.onload = function () {
        ctx[cindx].drawImage(label, ((maze[0].length * 16 / 2) - (label.width / 2)) * gfxScaleFactor, 0, label.width * gfxScaleFactor, label.height * gfxScaleFactor);
    };
}

//draw the path to end 
//path = final path drawn with dfs/bfs
//c    = "d" or "b" character to use for file selection
//cindx= whether to use dfs or bfs canvas
function drawPath(path, c, cindx) {
    for (let i = 1; i < path.length; i++) {
        let pathGfx = new Image();
        pathGfx.src = " ";

        const prev = path[i - 1];
        const current = path[i];

        if (current.x === prev.x && current.y === prev.y - 1) {
            pathGfx.src = "graphics/" + c + "down.png";
        } else if (current.x === prev.x && current.y === prev.y + 1) {
            pathGfx.src = "graphics/" + c + "up.png";
        } else if (current.x === prev.x - 1 && current.y === prev.y) {
            pathGfx.src = "graphics/" + c + "right.png";
        } else if (current.x === prev.x + 1 && current.y === prev.y) {
            pathGfx.src = "graphics/" + c + "left.png";
        }

        pathGfx.onload = function () {
            ctx[cindx].drawImage(pathGfx, 16 * prev.x * gfxScaleFactor, ((16 * prev.y) + 8) * gfxScaleFactor, 16 * gfxScaleFactor, 16 * gfxScaleFactor);
        };
    }
}