const log = console.log.bind(console)

const e = selector => document.querySelector(selector)
const es = selector => document.querySelectorAll(selector)
const appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)

const shuffle = function (rows, cols, mine) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
        arr.push(new Array(cols).fill(0))
    }
    fillMine(arr, cols, mine)
    let num = rows * cols
    for (let i = num - 1; i >= 0; i--) {
        const n = Math.floor(Math.random() * i)
        let [coordinateX, coordinateY] = transformXY(i + 1, cols, rows)
        let [randomX, randomY] = transformXY(n + 1, cols, rows)
        let temp = arr[coordinateY][coordinateX]
        arr[coordinateY][coordinateX] = arr[randomY][randomX]
        arr[randomY][randomX] = temp
    }
    return arr
}

const fillMine = function (squire, cols, mine) {
    if (mine < cols) {
        squire[0].fill(9, 0, mine)
    } else {
        line = Math.floor(mine / cols)
        for (let i = 0; i < line; i++) {
            squire[i].fill(9)
        }
        squire[line].fill(9, 0, mine % cols)
    }
}

const transformXY = function (num, cols, rows) {
    let y = Math.ceil(num / cols) - 1
    let x = num % cols === 0 ? cols - 1 : num % cols - 1
    return [x, y]
}

const markedSquare = function (array, cols, rows) {
    /*
    array 是一个「包含了『只包含了 0 9 的 array』的 array」
    返回一个标记过的 array
    0 会被设置为四周 8 个元素中 9 的数量
    */
    var square = [...array]
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (square[i][j] === 9) {
                markAround(square, i, j, cols, rows)
            }

        }
    }
    return square
}

const markAround = function (square, i, j, cols, rows) {

    let marked = [
        [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
        [i, j - 1], [i, j + 1],
        [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]
    ]
    for (let i = 0; i < marked.length; i++) {
        const x = marked[i][1];
        const y = marked[i][0];
        if (x >= 0 && y >= 0 && x < cols && y < rows) {
            if (square[y][x] !== 9) {
                square[y][x]++
            }
        }

    }

}

// templateRow 的参数 square 是二维数组, 用来表示雷相关的数据
// 返回 square.length 个 row 拼接的字符串
// row 的内容由 templateCell 函数生成
const templateRow = (square, over) => {
    let result = ''
    for (let i = 0; i < square.length; i++) {
        let ce = square[i]
        let row = templateCell(ce, i, over)
        result += ` <tr>${row}</tr>`
    }

    return result
}


// 返回 line.length 个 cell 拼接的字符串
const templateCell = (line, y, over) => {
    let result = ''
    let t
    for (let i = 0; i < line.length; i++) {
        let cell = line[i]
        let item = showItem(cell)
        let no = `no-${y}-${i}`
        if (over) {
            t = `
            <td>
                <div class="cell ${no} opened" data-number="${cell}" data-x="${i}" data-y="${y}">${item}</div>
            </td>
            `
        } else {
            t = `
            <td>
                <div class="cell ${no}" data-x="${i}" data-y="${y}"></div>
            </td>
            `
        }

        result += t
    }
    return result
}

const showItem = (cell) => {
    let result = ''
    switch (cell) {
        case 0:
            result = ''
            break;
        case 9:
            result = '💣'
            break;
        default:
            result = String(cell)
    }
    return result
}


// square 是二维数组, 用来表示雷相关的数据
// 用 square 生成 9 * 9 的格子, 然后插入到页面中
const renderSquare = (square, over = false) => {
    let Container = e('#id-div-mime')
    Container.innerHTML = ''
    appendHtml(Container, templateRow(square, over))
}

const clickCell = function (square, rows, cols, mine) {
    let cells = es('.cell')
    cells.forEach(function (cell) {
        cell.addEventListener("mousedown", function (e) {
            if (e.button == 2) {
                // log("你点了右键");
                e.preventDefault();
                cell.classList.toggle('flag')
            } else if (e.button == 0) {
                // log("你点了左键");
                let x = Number(cell.dataset.x)
                let y = Number(cell.dataset.y)
                openCell(square, y, x, cell)
                isWin(rows, cols, mine)
            }
        })
    });
}

const isWin = function (rows, cols, mine) {
    let cells = es('.opened').length
    let total = rows * cols
    if (total - cells === mine) {
        alert('you win!')
    }
}

const openCell = function (square, i, j, self) {
    if (self.classList.contains('opened')) {
        return
    }
    self.classList.add('opened')
    if (square[i][j] === 9) {
        renderSquare(square, true)
    } else if (square[i][j] === 0) {
        let marked = [
            [i - 1, j - 1], [i - 1, j], [i - 1, j + 1],
            [i, j - 1], [i, j + 1],
            [i + 1, j - 1], [i + 1, j], [i + 1, j + 1]
        ]
        for (let i = 0; i < marked.length; i++) {
            const x = marked[i][1];
            const y = marked[i][0];
            let rows = square.length
            let cols = square[0].length
            if (x >= 0 && y >= 0 && x < cols && y < rows) {
                let cls = `.no-${y}-${x}`
                let ele = e(cls)
                setTimeout(
                    openCell(square, y, x, ele), 10
                )
            }

        }
    } else {
        self.innerHTML = square[i][j]
    }
}

const selectLevel = function (levels) {
    let option = e('#level-select')
    option.addEventListener('change', function () {
        value = option.value
        level = levels[value]
        init(level)
    })
}

const reset = function (levels) {
    let option = e('#level-select')
    let button = e('#reset')
    button.addEventListener('click', function () {
        value = option.value
        level = levels[value]
        init(level)
    })
}


const init = (level) => {
    let { rows, cols, mine } = level
    let array = shuffle(rows, cols, mine)
    let square = markedSquare(array, cols, rows)
    renderSquare(square)
    clickCell(square, rows, cols, mine)
}

const __main = () => {
    const levels = {
        'beginner': {
            'rows': 9,
            'cols': 9,
            'mine': 5,
        },
        'intermediate': {
            'rows': 16,
            'cols': 16,
            'mine': 44,
        },
        'expert': {
            'rows': 16,
            'cols': 30,
            'mine': 99,
        },
    };
    let level = levels['beginner']
    init(level)
    selectLevel(levels)
    reset(levels)
}

__main()
