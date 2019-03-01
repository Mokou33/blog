layui.use(["element", "laypage"], () => {
  let element = layui.element
  let laypage = layui.laypage
  const $ = layui.$

  element.tabDelete('demo', 'xxx')

  laypage.render({
    elem: "laypage",
    count: $("#laypage").data("maxnum"),
    limit: 5,
    groups: 3,
    curr: location.pathname.replace("/page/", ""),
    jump(obj, f){
      $("#laypage a").each((i, v) => {
        let num = $(v).data("page")
        // let pageValue = `/page/${$(v).data("page")}`
        console.log(num);
        console.log(`/page/${$(v).data("page")}`);


        let pageValue = (num < 1) ? "/page/1" : `/page/${num}`
        v.href = pageValue
        // console.log(pageValue);


      })


    }
  })
})
