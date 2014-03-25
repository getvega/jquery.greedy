(function ($) {

    $.Greedy = function (options, element) {
        this.$el = $(element);
        this._init(options);
    };

    $.Greedy.defaults = {
        columns: 8,
        lines: 6,
        itemWidth: 100,
        itemHeight: 100,
        timer: 1000,
        transitionDelay: 300,
        height: 0,
        width: 0
    }

    $.Greedy.prototype = {
        _init: function (options) {
            this.options = $.extend(true, {}, $.Greedy.defaults, options);
            this.pool = [];


            var x = Math.ceil(this.options.width / this.options.itemWidth);
            var y = Math.ceil(this.options.height / this.options.itemHeight);
            if (this.count === x * y) return;
            this.count = x * y;

            var $mask = $('<div/>').css('overflow', 'hidden').css('height', 'inherit');
            var $ul = $('<ul/>').css('font-size', 0).css('width', x * this.options.itemWidth);

            for (var i = 0; i < this.count; i++)
                $ul.append(this.createItem())

            this.$el.html($mask.html($ul).hide().show());

            this.next();
        },
        randomBackgroundPosition: function () {
            var i = Math.floor(Math.random() * 1000);
            var modulo = i % this.options.columns;
            var remainder = parseInt(i / this.options.columns);

            var x = -1 * (modulo * this.options.itemWidth);
            var y = -1 * ((remainder % this.options.lines) * this.options.itemHeight);
            return x + 'px ' + y + 'px';
        },
        createImage: function () {
            if (this.pool.length) {
                var $newElement = this.pool.pop();
                $newElement.css('background-position', this.randomBackgroundPosition());
                return $newElement;
            } else {
                return $('<div/>')
                    .css('background-image', 'url(' + this.options.src + ')')
                    .css('background-position', this.randomBackgroundPosition())
                    .css('width', this.options.itemWidth).css('height', this.options.itemHeight)
                    .css('position', 'absolute')
                    .css('top', 0).css('left', 0);
            }
        },
        createItem: function () {
            return $('<li/>')
                .css('width', this.options.itemWidth).css('height', this.options.itemHeight)
                .css('position', 'relative')
                .css('display', 'inline-block')
                .append(this.createImage());
        },
        next: function () {
            var self = this;
            clearTimeout(this.play);
            this.play = setTimeout(function () {
                self.showNext();
                self.next();
            }, this.options.timer);
        },
        showNext: function () {
            var self = this;
            var $items = this.$el.find('li');
            var $rand = $items.get(Math.floor(Math.random() * $items.length));
            var $out = $($rand).find('div:last');

            if ($out.hasClass('fading')) return this.showNext();
            $out.addClass('fading');

            var $in = this.createImage();
            $in.prependTo($rand);

            setTimeout(function () {
                $out.remove()
                    .removeClass('fading');
                self.pool.push($out);
            }, this.options.transitionDelay);
        }
    }

    $.fn.greedy = function (options) {
        this.each(function () {
            var instance = $.data(this, 'greedy');
            if (instance)
                instance._init(options);
            else
                $.data(this, 'greedy', new $.Greedy(options, this));
        });
        return this;
    }

}(window.jQuery || window.$));
