const data = [
    { id: 1, name: "用户管理", pid: 0 },
    { id: 2, name: "菜单申请", pid: 1 },
    { id: 3, name: "信息申请", pid: 1 },
    { id: 4, name: "模块记录", pid: 2 },
    { id: 5, name: "系统设置", pid: 0 },
    { id: 6, name: "权限管理", pid: 5 },
    { id: 7, name: "用户角色", pid: 6 },
    { id: 8, name: "菜单设置", pid: 6 },
];

const e = selector => document.querySelector(selector)
const es = selector => document.querySelectorAll(selector)
const appendHtml = (element, html) => element.insertAdjacentHTML('beforeend', html)

//递归清洗数据
const dataToTree = function (data) {
    let arr = data.filter(x => x.pid === 0)
    function inner(data, arr) {
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            let pid = element.id
            let children = data.filter(x => x.pid === pid)
            if (children) {
                element.children = children
                inner(data, element.children)
            }

        }
    }
    inner(data, arr);
    return arr
}

const treeToList = function (arr) {
    let menus = '';
    function inner(arr) {
        arr.forEach((element) => {
            let { id, pid, name } = element
            let t = `
            <input type="checkbox" data-id="${id}" data-pid="${pid}" class="cbox" id="cbox${id}" value="${name}">
            <label for="cbox${id}">${name}</label>
            `
            if (element.children.length > 0) {
                menus += `<li><span class="caret">
                ${t}
                </span>`;
                menus += '<ul class="nested">'
                inner(element.children)
                menus += '</ul>';
                menus += '</li>';
            } else {
                menus += `<li>${t}</li>`
            }

        })
    }
    inner(arr)
    return menus
}

const renderTree = function () {
    let tree = dataToTree(data)
    let list = treeToList(tree)
    let treeView = e('#tree-view')
    appendHtml(treeView, list)
}

const bindEventClick = function () {
    let treeView = e('#tree-view')
    treeView.addEventListener("click", function (event) {
        let self = event.target
        if (self.classList.contains("caret")) {
            //找到公共父元素
            let el = self.closest("li").querySelector(".nested")
            el.classList.toggle("active")
            self.classList.toggle("caret-down")
        }
    })
}

const setChecked = function () {
    let checkBoxes = es(".cbox");
    checkBoxes.forEach((box) => {
        box.addEventListener('click', (event) => {
            childCheck(event.target)
            parentCheck(event.target)
        });
    });
}

//点击父元素选择所有子项目
const childCheck = function (box) {
    let ul = box.closest("li").querySelector(".nested");
    if (ul) {
        let children = ul.querySelectorAll(".cbox");
        children.forEach((child) => {
            child.checked = box.checked
            childCheck(child)
        });
    }
}

//判断所有兄弟元素是否都被选中
const isAllBrosCheck = function (box) {
    let bros = box.closest("ul").querySelectorAll(".cbox");
    for (let i = 0; i < bros.length; i++) {
        const bro = bros[i];
        if (!bro.checked) {
            return false
        }
    }
    return true
}

//取消选择一个元素，父元素也会取消选择
//如果所有子项目都是选中状态，父元素也会被选中
const parentCheck = function (box) {
    let pid = Number(box.dataset.pid)
    if (pid !== 0) {
        let id = `#cbox${pid}`
        let parent = e(id)
        if (!box.checked) {
            parent.checked = false
            parentCheck(parent)
        } else {
            if (isAllBrosCheck(box)) {
                parent.checked = true
                parentCheck(parent)
            }
        }
    }
}

const __main = () => {
    renderTree()
    bindEventClick()
    setChecked()
}

__main()

