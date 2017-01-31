$(document).ready(function(){
    var textArch = (function(){
        var config = {
            fullCircle : true
        };

        var $text,
            lettersWidth = [],
            radius = 200,
            s = 0, //outer circle radius
            fi = 0, //sum of all letter angles before current letter
            startAngle = 180,
            spacingAngleBetweenLetters = 0;

        return {
            init : function(){
                $text = $('#text');

                this.wrapWholeTextInDiv();
                this.wrapLettersInSpans();
                this.getLettersWidth();
                this.getSpacingAngleBetweenLetters();
                this.drawLetters();
            },
            degInRad : function(deg){
              return deg * Math.PI/180;
            },
            radInDeg : function(rad){
              return rad*180/Math.PI;
            },
            wrapLettersInSpans : function(){
                var textString = $text.html(),
                    newTextString = '';

                newTextString = '<span>'+textString.split('').join('</span><span>')+'</span>';
                $text.parent().html(newTextString);

                $(".textarch").css({
                    'position' : 'absolute',
                    'left' : '300px',
                    'top': '300px'
                });
            },
            wrapWholeTextInDiv : function(){
                $("#text").wrap("<div class='textarch'></div>");
                $(".textarch").css({
                    'position' : 'relative'
                });
            },
            getLettersWidth : function(){
                $(".textarch span").each(function (index, value) {
                    lettersWidth.push($(this).width());
                });
            },
            getAlpha : function(letterWidth){
                var alpha,
                    alphaInDegrees;
                s = Math.sqrt(Math.pow(radius,2)+Math.pow((letterWidth/2),2));
                alpha = 2 * Math.acos(radius/s);

                //convert radians into degrees
                alphaInDegrees = this.radInDeg(alpha);

                return alphaInDegrees;
            },
            getStartingAngle : function(){
                return startAngle - fi;
            },
            getLetterAngle : function(alpha){
                var angle = 90-(fi+alpha/2);
                return angle > 0 ? angle : 360+angle;
            },
            getSpacingAngleBetweenLetters : function(){
              if(config.fullCircle){
                var circumference = 2 * radius * Math.PI,
                    allLettersWidth = 0,
                    numberOfLetters = lettersWidth.length;

                for(i=0;i<lettersWidth.length;i++){
                    allLettersWidth += parseInt(lettersWidth[i]);
                }

                var freeSpace = circumference - allLettersWidth,
                    spacingBetweenLetters = freeSpace / numberOfLetters;

                  spacingAngleBetweenLetters = this.getAlpha(spacingBetweenLetters);
              }
              else {
                  spacingAngleBetweenLetters = 0;
              }

            },
            drawLetter : function(letterIndex){
                var d = lettersWidth[letterIndex],
                    alpha = this.getAlpha(d),
                    startingAngle = this.getStartingAngle(),
                    letterAngle = this.getLetterAngle(alpha);

                console.log("d:"+d);
                console.log("alpha:"+alpha);
                console.log("startingAngle:"+startingAngle);
                console.log("letterAngle:"+letterAngle);

                var x = s * Math.cos(this.degInRad(startingAngle));
                var y = s * Math.sin(this.degInRad(startingAngle));

                console.log("x:"+x+" y:"+y);
                console.log($(".textarch span").eq(letterIndex).html());

                $(".textarch span").eq(letterIndex).css({
                    'position' : 'absolute',
                    'bottom' : y + 'px',
                    'left' : x + 'px',
                    'transform' : 'rotate(-'+letterAngle+'deg)',
                    ' -webkit-transform' : 'rotate(-'+letterAngle+'deg)',
                    'transform-origin' : '0% 100%' //select bottom left corner for rotation
                });

                fi += alpha + spacingAngleBetweenLetters;


                console.log('-------------------------------------');

            },
            drawLetters : function(){
                for(var i=0;i<lettersWidth.length;i++){
                    this.drawLetter(i);
                }
            }


        }
    })();

    textArch.init();
});
