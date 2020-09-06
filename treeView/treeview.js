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
            if (element.children.length > 0) {
                menus += `<li><span class="caret">${element.name}</span>`;
                menus += '<ul class="nested">';
                inner(element.children)
                menus += '</ul>';
                menus += '</li>';
            } else {
                menus += `<li>${element.name}</li>`;
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
            let el = self.closest("li").querySelector(".nested");
            el.classList.toggle("active");
            self.classList.toggle("caret-down");
        }
    })
}


const __main = () => {
    renderTree()
    bindEventClick()
}

__main()

