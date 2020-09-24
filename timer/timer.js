const e = selector => document.querySelector(selector)
const es = selector => document.querySelectorAll(selector)

const getLeftSeconds = function (endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    return total
}

const getTimeRemaining = function (endtime) {
    const total = getLeftSeconds(endtime)
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
        days,
        hours,
        minutes,
        seconds
    };
}

const twoNum = function (num) {
    let nums = []
    nums[0] = Math.floor(num / 10)
    nums[1] = num % 10
    return nums
}

const renderTime = function (endtime, cls) {
    const t = getTimeRemaining(endtime);
    let [h1, h2] = twoNum(t.hours)
    let [m1, m2] = twoNum(t.minutes)
    let [s1, s2] = twoNum(t.seconds)
    let day = t.days
    let els = es(cls)
    e('.day').textContent = day
    els[0].textContent = h1
    els[1].textContent = h2
    els[2].textContent = m1
    els[3].textContent = m2
    els[4].textContent = s1
    els[5].textContent = s2
}

const cal = function (endtime) {
    const t = getTimeRemaining(endtime);
    let [h1, h2] = twoNum(t.hours)
    let [m1, m2] = twoNum(t.minutes)
    let [s1, s2] = twoNum(t.seconds)
    if (s2 === 0) {
        addClass('.s1-2')
        if (s1 === 0) {
            addClass('.m2-2')
            if (m2 === 0) {
                addClass('.m1-2')
                if (m1 === 0) {
                    addClass('.h2-2')
                    if (h2 === 0) {
                        addClass('.h1-2')
                    }
                }
            }
        }
    }
}

const render = function (endtime) {
    let total = getLeftSeconds(endtime)
    if (total <= 0) {
        return
    }
    e('.s2-2').classList.add('pic-ani')
    renderTime(endtime, '.pic-front')
    renderTime(new Date(endtime.getTime() - 1000), '.pic-back')
    const timeinterval = setInterval(() => {
        renderTime(endtime, '.pic-front')
        renderTime(new Date(endtime.getTime() - 1000), '.pic-back')
        total = getLeftSeconds(endtime)
        cal(endtime)
        if (total <= 0) {
            clearInterval(timeinterval);
        }

    }, 1000);
}

const addClass = function (cls) {
    e(cls).classList.add("pic-ani");
    setTimeout(() => {
        e(cls).classList.remove("pic-ani");
    }, 1000)
}

const __main = function () {
    const date = new Date('2020-10-01T00:00:00');
    render(date)
};

__main()
