const debounce = function (fn, delay = 800) {
    let time = null
    // 将回调接收的参数保存到args数组中
    function _debounce(...args) {
        // 如果time不为0，也就是说有定时器存在，将该定时器清除
        if (time !== null) {
            clearTimeout(time)
        }

        time = setTimeout(() => {
            fn.apply(this, args);
        }, delay)
    }

    // 防抖函数会返回另一个函数，该函数才是真正被调用的函数
    return _debounce;
}

export default debounce;