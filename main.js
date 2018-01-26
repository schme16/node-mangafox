var $ = new require('./jquack.js');

var mangaFox = {};

var mangaFoxBaseURI = "http://mangafox.la";

//Gets info about a manga
mangaFox.getDetails = function(id, callback) {
    $.post(mangaFoxBaseURI + '/ajax/series.php', { sid: id }, function(data) {

        try { data = JSON.parse(data); } catch (e) {};

        (callback || function() {})(data);
    });
}

//Gets all available manga titles
mangaFox.getManga = function(callback) {
    $.get(mangaFoxBaseURI + '/manga/', function(data) {
        var list = {};

        data.find('.manga_list li a').each(function(index, d) {
            var b = $(d);
            list[mangaFox.fixTitle(b.text())] = { id: b.attr('rel'), title: b.text() };
        });

        (callback || function() {})(list);
    }, true);
}

//Get the number of pages in a chapter
mangaFox.getPages = function(manga, ch, callback) {
    $.get(mangaFoxBaseURI + '/manga/' + mangaFox.fixTitle(manga) + '/c' + mangaFox.pad(ch, 3) + '/1.html', function(d) {
        callback((d.find('.l option').length - 2) / 2);
    }, true);
};

//Get the urls for page images
mangaFox.getImages = function(manga, ch, callback) {
    mangaFox.getPages(manga, ch, function(num) {
        var data = [];
        var numPageRequestToBeReturned = num;

        var temp = function(n) {
            $.get(mangaFoxBaseURI + '/manga/' + mangaFox.fixTitle(manga) + '/v01/c' + mangaFox.pad(ch, 3) + '/' + n + '.html', function(d) {
                data[n - 1] = d.find('#viewer img').attr('src');

                numPageRequestToBeReturned--;

                if (numPageRequestsToBeReturned <= 0) {
                    (callback || function() {})(data);
                }
            }, true);
        };

        for (i = 1; i <= num; i++) {
            temp(i);
        }
    });

};

//Gets the number of available chapters
mangaFox.getChapters = function(manga, callback) {
    $.get(mangaFoxBaseURI + '/manga/' + mangaFox.fixTitle(manga), function(d) {
        callback($(d.find('.chlist .tips')[0]).text().replace(/\D/g, ''));
    }, true);
};

//Gets the number of available chapters
mangaFox.search = function(manga, callback) {
    $.get(mangaFoxBaseURI + '/search.php?name_method=cw&name=' + encodeURIComponent(manga) + '&type=&author_method=cw&author=&artist_method=cw&artist=&genres%5BAction%5D=0&genres%5BAdult%5D=0&genres%5BAdventure%5D=0&genres%5BComedy%5D=0&genres%5BDoujinshi%5D=0&genres%5BDrama%5D=0&genres%5BEcchi%5D=0&genres%5BFantasy%5D=0&genres%5BGender+Bender%5D=0&genres%5BHarem%5D=0&genres%5BHistorical%5D=0&genres%5BHorror%5D=0&genres%5BJosei%5D=0&genres%5BMartial+Arts%5D=0&genres%5BMature%5D=0&genres%5BMecha%5D=0&genres%5BMystery%5D=0&genres%5BOne+Shot%5D=0&genres%5BPsychological%5D=0&genres%5BRomance%5D=0&genres%5BSchool+Life%5D=0&genres%5BSci-fi%5D=0&genres%5BSeinen%5D=0&genres%5BShoujo%5D=0&genres%5BShoujo+Ai%5D=0&genres%5BShounen%5D=0&genres%5BShounen+Ai%5D=0&genres%5BSlice+of+Life%5D=0&genres%5BSmut%5D=0&genres%5BSports%5D=0&genres%5BSupernatural%5D=0&genres%5BTragedy%5D=0&genres%5BWebtoons%5D=0&genres%5BYaoi%5D=0&genres%5BYuri%5D=0&released_method=eq&released=&rating_method=eq&rating=&is_completed=&advopts=1', function(d) {
        var list = {};
        //console.log(d.find('#mangalist'), mangaFoxBaseURI + '/search.php?name_method=cw&name=' + encodeURIComponent(manga) + '&type=&author_method=cw&author=&artist_method=cw&artist=&genres%5BAction%5D=0&genres%5BAdult%5D=0&genres%5BAdventure%5D=0&genres%5BComedy%5D=0&genres%5BDoujinshi%5D=0&genres%5BDrama%5D=0&genres%5BEcchi%5D=0&genres%5BFantasy%5D=0&genres%5BGender+Bender%5D=0&genres%5BHarem%5D=0&genres%5BHistorical%5D=0&genres%5BHorror%5D=0&genres%5BJosei%5D=0&genres%5BMartial+Arts%5D=0&genres%5BMature%5D=0&genres%5BMecha%5D=0&genres%5BMystery%5D=0&genres%5BOne+Shot%5D=0&genres%5BPsychological%5D=0&genres%5BRomance%5D=0&genres%5BSchool+Life%5D=0&genres%5BSci-fi%5D=0&genres%5BSeinen%5D=0&genres%5BShoujo%5D=0&genres%5BShoujo+Ai%5D=0&genres%5BShounen%5D=0&genres%5BShounen+Ai%5D=0&genres%5BSlice+of+Life%5D=0&genres%5BSmut%5D=0&genres%5BSports%5D=0&genres%5BSupernatural%5D=0&genres%5BTragedy%5D=0&genres%5BWebtoons%5D=0&genres%5BYaoi%5D=0&genres%5BYuri%5D=0&released_method=eq&released=&rating_method=eq&rating=&is_completed=&advopts=1')
        d.find('#mangalist > ul li').each(function(i, e) {
            var b = $(e).find('.title');
            var img = $(e).find('.manga_img img');
            list[b.text()] = { id: b.attr('rel'), title: b.text(), img: img.attr('src') };
        });
        callback(list);
    }, true);
};

//get the list of currently popular manga
mangaFox.getPopular = function(callback) {
    $.get(mangaFoxBaseURI + '/', function(d) {
        var list = {};
        d.find('#popular li div.nowrap a').each(function(i, e) {
            var b = $(e);
            list[b.text()] = { id: b.attr('rel'), title: b.text() };
        });
        callback(list);
    }, true);
};

//get the list of currently popular manga
mangaFox.getLatest = function(callback) {
    $.get(mangaFoxBaseURI + '/', function(d) {
        var list = {};
        d.find('#new li div.nowrap a').each(function(i, e) {
            var b = $(e);
            list[b.text()] = { id: b.attr('rel'), title: b.text() };
        });
        callback(list);
    }, true);
};

//makes all titles conform to the title conventions
mangaFox.fixTitle = function(title) {
    var t = title.replace(/[^a-zA-Z\d\s-]/g, '_');
    t = t.replace(/\ /g, '_');
    t = t.replace(/\-/g, '_').toLowerCase();
    t = t.replace(/\___/g, '_');
    t = t.replace(/\__/g, '_');
    if (t.substr(t.length - 1) == '_') {
        t = t.substr(0, t.length - 1);
    }

    if (t.substr(0, 1) == '_') {
        t = t.substr(1);
    }
    return t;
};

//pads single digit numbers to ther xxx equivalent
mangaFox.pad = function(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

module.exports = mangaFox;