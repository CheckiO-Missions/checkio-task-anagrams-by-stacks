//Dont change it
requirejs(['ext_editor_1', 'jquery_190', 'raphael_210'],
    function (ext, $, TableComponent) {

        var cur_slide = {};

        ext.set_start_game(function (this_e) {
        });

        ext.set_process_in(function (this_e, data) {
            cur_slide["in"] = data[0];
        });

        ext.set_process_out(function (this_e, data) {
            cur_slide["out"] = data[0];
        });

        ext.set_process_ext(function (this_e, data) {
            cur_slide.ext = data;
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_process_err(function (this_e, data) {
            cur_slide['error'] = data[0];
            this_e.addAnimationSlide(cur_slide);
            cur_slide = {};
        });

        ext.set_animate_success_slide(function (this_e, options) {
            var $h = $(this_e.setHtmlSlide('<div class="animation-success"><div></div></div>'));
            this_e.setAnimationHeight(115);
        });

        ext.set_animate_slide(function (this_e, data, options) {
            var $content = $(this_e.setHtmlSlide(ext.get_template('animation'))).find('.animation-content');
            if (!data) {
                console.log("data is undefined");
                return false;
            }

            var checkioInput = data.in;

            if (data.error) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.output').html(data.error.replace(/\n/g, ","));

                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
                $content.find('.answer').remove();
                $content.find('.explanation').remove();
                this_e.setAnimationHeight($content.height() + 60);
                return false;
            }

            var rightResult = data.ext["answer"];
            var userResult = data.out;
            var result = data.ext["result"];
            var result_addon = data.ext["result_addon"][1];
            var result_user = data.ext["result_addon"][0];


            //if you need additional info from tests (if exists)
            var explanation = data.ext["explanation"];

            $content.find('.output').html('&nbsp;Your result:&nbsp;' + JSON.stringify(userResult));

            if (!result) {
                $content.find('.call').html('Fail: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').html(result_addon);
                $content.find('.answer').addClass('error');
                $content.find('.output').addClass('error');
                $content.find('.call').addClass('error');
            }
            else {
                $content.find('.call').html('Pass: checkio(' + JSON.stringify(checkioInput) + ')');
                $content.find('.answer').remove();
            }
            //Dont change the code before it

            var canvas = new AnagramsByStacksCanvas(checkioInput);
            canvas.createCanvas($content.find(".explanation")[0]);
            canvas.animateCanvas(result_user);



            this_e.setAnimationHeight($content.height() + 60);

        });

        var $tryit;
        var tcanvas;
        var tdata;
//
        ext.set_console_process_ret(function (this_e, ret) {
            $tryit.find(".checkio-result-in").html("Result:<br>" +  ret);
            tcanvas.clearAnimation();
            tcanvas.removeCanvas();
            tcanvas = new AnagramsByStacksCanvas(tdata);
            tcanvas.createCanvas($tryit.find(".tryit-canvas")[0]);

//            var acts = tcanvas.checkActions(ret);
//            console.log(typeof(ret));
            if (typeof(ret) === "string") {
                ret = ret.replace(/\'/g, "");
                setTimeout(tcanvas.animateCanvas(ret, $tryit.find(".checkio-result-err")[0]), 200);
            }
        });

        ext.set_generate_animation_panel(function (this_e) {

            $tryit = $(this_e.setHtmlTryIt(ext.get_template('tryit')));

            tcanvas = new AnagramsByStacksCanvas('rice-cire');
            tcanvas.createCanvas($tryit.find(".tryit-canvas")[0]);

            $tryit.find(".word").keyup(function(e){
                var first = $tryit.find(".first-word").val();
                var second = $tryit.find(".second-word").val();
                if (first.split("").sort().join("") !== second.split("").sort().join("")) {
                    $tryit.find(".word").removeClass("correct");
                }
                else {
                    $tryit.find(".word").addClass("correct");
                }
            });


            $tryit.find('.bn-check').click(function (e) {
                e.preventDefault();
                var first = $tryit.find(".first-word").val();
                var second = $tryit.find(".second-word").val();
                $tryit.find(".checkio-result-err").html("");

                if (!first || !second) {
                    $tryit.find(".checkio-result-in").html("Empty request");
                    return false;
                }
                if (first.split("").sort().join("") !== second.split("").sort().join("")) {
                    $tryit.find(".checkio-result-in").html("These are not anagrams.");
                    return false;
                }
                tdata = first + "-" + second;
                this_e.sendToConsoleCheckiO(tdata);
                return false;
            });

        });

        function AnagramsByStacksCanvas(data) {
            var startWord = data.split("-")[0];


            var zx = 10;
            var zy = 10;
            var cellSize = 30;
            var cellN = startWord.length;
            var padding = cellSize / 2;

            var delay = 500;
            var stepDelay = delay * 1.5;

            var outX = zx + (cellN + 1.5) * cellSize;
            var rowY = [
                zy + cellSize * 1.5 + padding,
                zy + cellSize / 2,
                zy + cellSize * 2.5 + padding * 2
            ];
            var stacksOrder = [1, 0, 2];


            var fullSizeX = 2 * zx + (cellN + 2) * cellSize;
            var fullSizeY = 2 * zy + 3 * cellSize + 2 * padding;

            var colorDark = "#294270";
            var colorOrange = "#F0801A";
            var colorBlue = "#8FC7ED";

            var attrLetter = {"font-family": "Verdana", "font-size": cellSize * 0.8, "stroke": colorDark};
            var attrRect = {"stroke": colorDark, "stroke-width": 2};

            var paper;
            var letters;
            //timers for animation
            var tId = [];



            this.createCanvas = function (dom) {
                paper = Raphael(dom, fullSizeX, fullSizeY, 0, 0);
                letters = paper.set();
                for (var i = 0; i < 3; i++) {
                    paper.text(zx + cellSize / 2, rowY[stacksOrder[i]], String(stacksOrder[i])).attr(attrLetter);
                    if (stacksOrder[i] !== 0) {
                        for (var j = 0; j < cellN; j++) {
                            paper.rect(
                                zx + cellSize * (j + 1),
                                zy + cellSize * i + padding * i,
                                cellSize, cellSize
                            ).attr(attrRect);
                        }
                    }
                    else {
                        paper.rect(
                            zx + cellSize,
                            zy + cellSize * i + padding * i,
                            cellSize, cellSize
                        ).attr(attrRect);
                    }
                    letters.push(paper.set());
                }
                for (j = 0; j < cellN; j++) {
                    var l = paper.text(
                        zx + cellSize * 1.5 + j * cellSize,
                        zy + cellSize / 2,
                        startWord[j]
                    ).attr(attrLetter);
                    letters[1].push(l);
                }
            };

            this.removeCanvas = function() {
                paper.remove();
            };

            this.checkActions = function(actions) {
                var GOOD_ACTIONS = ["10", "12", "01", "02", "21", "20"];
                var actList = actions.split(",");
                var result = [];
                for (var i = 0; i < actList.length; i++) {
                    if (GOOD_ACTIONS.indexOf(actList[i]) === -1) {
                        return [result.join(","), "Wrong action " + actList[i]];
                    }
                    var from = parseInt(actList[i][0]);
                    var to = parseInt(actList[i][1]);
                    if (letters[from].length === 0) {
                        return [result.join(","), "Tried to pop from empty stack"];
                    }
                    if (to === 0 || letters[0].length >= 1) {
                        return [result.join(","), "Tried to push in the full buffer"];
                    }

                }
            };

            this.clearAnimation = function() {
                if (tId) {
                    for (var i = 0; i < tId.length; i++) {
                        clearTimeout(tId[i]);
                    }
                }
                tId = [];
            };

            this.animateCanvas = function (actions, dom_message) {
                var GOOD_ACTIONS = ["10", "12", "01", "02", "21", "20"];
                var actList = actions.split(",");
                for (var i = 0; i < actList.length; i++) {
                    var from = parseInt(actList[i][0]);
                    var to = parseInt(actList[i][1]);
                    if (GOOD_ACTIONS.indexOf(actList[i]) === -1) {
                        $(dom_message).html("Wrong action " + actList[i]);
                        break;
                    }
                    if (letters[from].length === 0) {
                        $(dom_message).html("Tried to pop from empty stack");
                        break;
                    }
                    if (to === 0 && letters[0].length >= 1) {
                        $(dom_message).html("Tried to push in the full buffer");
                        break;
                    }

                    var moved = letters[from].pop();
                    letters[to].push(moved);
                    tId.push(setTimeout(function () {
                        var l = moved;

                        var diffY = rowY[to] - rowY[from];
                        var endInStack = letters[to].length - 1;

                        return function () {
                            var xl = l.attr("x");
                            var yl = l.attr("y");
                            var diffX1 = outX - xl;
                            var diffX2 = (endInStack + 1.5) * cellSize + zx - outX;
                            var xlEnd = xl + diffX1 + diffX2;
                            var ylEnd = yl + diffY;
                            var fullPath = Math.abs(diffX1) + Math.abs(diffX2) + Math.abs(diffY);
                            var t1 = delay * Math.abs(diffX1) / fullPath;
                            var t2 = delay * Math.abs(diffY) / fullPath;
                            var t3 = delay * Math.abs(diffX2) / fullPath;
                            l.animate({"transform": "t" + diffX1 + ",0"}, t1,
                                callback = function () {
                                    l.animate({"transform": "...t0," + diffY}, t2,
                                        callback = function () {
                                            l.animate({"transform": "...t" + diffX2 + ",0"}, t3,
                                                callback = function () {
                                                    l.attr("x", xlEnd);
                                                    l.attr("y", ylEnd);
                                                    l.attr("transform", "");
                                                })
                                        })
                                });

                        }

                    }(), stepDelay * i));
                }
            }
        }


    }
);
