jQuery(document).ready(function (d) {
    d(".github-box").each(function () {
		var i = d(this);
		var f = i.data("repo");

        d.ajax({
            url: "https://api.github.com/repos/" + f,
            dataType: "jsonp",
            success: function (n) {
                var m = n.data,
                    l, o = "unknown";
                if (m.pushed_at) {
                    l = new Date(m.pushed_at);
                    o = (l.getMonth() + 1) + "-" + l.getDate() + "-" + l.getFullYear()
                }
                i.find(".watchers").text(m.watchers);
                i.find(".forks").text(m.forks);
                i.find(".description span").text(m.description);
                i.find(".updated span").html(o);
                if (m.homepage != null) {
                    i.find(".link").append(d("<a />").attr("href", m.homepage).text(m.homepage))
                }
            }
        })
    })
});