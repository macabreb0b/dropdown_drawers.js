$.MetricBox = function(el, metric, query) {
    this.$el = $(el);
    this.query = query;
    
    var $block = $('<div class="main-block">');
    this.$el.append($block);
    
    this.$nameBlock = $('<div class="name-block">');
    $block.append(this.$nameBlock);
    this.$btn = $('<div class="deactivate-block">');
    $block.append(this.$btn)
    
    this.$drawer = $('<div class="drawer">');
    this.$handle = $('<div class="handle">=</div>');
    this.$drawer.append(this.$handle);
    
    this.$buckets = $('<div class="buckets">');
    this.$drawer.append(this.$buckets);
    
    this.$el.append(this.$drawer);
    
    this.revealed = false;
        
    if (metric !== undefined) {
        this.setMetric(metric);
    }
};

$.MetricBox.prototype.activate = function() {
    this.stopInactiveListeners();
    this.startActiveListeners();
    this.query.$el.trigger('activateMetric', this);
    return false;
};

$.MetricBox.prototype.deactivate = function() {
    this.stopActiveListeners();
    this.startInactiveListeners();
    this.slideDown();
    this.query.$el.trigger('deactivateMetric', this);
    return false;
};

$.MetricBox.prototype.startActiveListeners = function() {
    this.$btn.on('click', this.deactivate.bind(this));
    this.$nameBlock.on('click', this.toggleSlide.bind(this))
    this.$handle.on('click', this.toggleSlide.bind(this));
    this.$buckets.on('click', '.bucket', this.toggleSelection.bind(this));
};

$.MetricBox.prototype.stopActiveListeners = function() {
    this.$nameBlock.off();
    this.$handle.off();
    this.$buckets.off();
    this.$btn.off();
};

$.MetricBox.prototype.startInactiveListeners = function() {
    this.$el.on('click', this.activate.bind(this));
};

$.MetricBox.prototype.stopInactiveListeners = function() {
    this.$el.off();
}

$.MetricBox.prototype.setMetric = function(metric) {
    this.clearState();
    
    this.metric = metric;
    var name = $('<span>')
    name.text(metric['name']);
    this.$nameBlock.append(name);
    
    var closeBtn = $('<a class="deactivate-metric">&#x2717;</a>');
    this.$btn.append(closeBtn);
    
    this.buildPercentiles();
    
    if (metric.active) {
        this.activate();
    } else {
        this.deactivate();
    }
};

$.MetricBox.prototype.clearState = function() {
    this.$nameBlock.html('');
    this.$el.find('.bucket').remove();
}

$.MetricBox.prototype.toggleSlide = function() {
    if (this.revealed) {
        this.slideDown();
    } else {
        this.slideUp();
    }
    return false;
};

$.MetricBox.prototype.slideDown = function() {
    this.$drawer.css('top', '-20px')
    this.revealed = false;
};

$.MetricBox.prototype.slideUp = function() {
    var len = this.metric['buckets'].length;
    var newTop = ((len * 50) + 20) * -1;
    this.$drawer.css('top', newTop + 'px');
    this.$drawer.addClass('open');
    this.revealed = true;
};

$.MetricBox.prototype.buildPercentiles = function() {
    var buckets = this.metric['buckets'];
    for (var i = 0; i < buckets.length; i++) {
        var bucket = buckets[i];
        this.buildPercentile(bucket, i);
    }
};

$.MetricBox.prototype.toggleSelection = function(event) {
    var $target = $(event.currentTarget);
    var ord = $target.data('ord');
    var bucket = this.metric.buckets[ord];

    this.selectPercentile(ord, $target);

};

$.MetricBox.prototype.selectPercentile = function(ord, $bucket) {
    $bucket.siblings().removeClass('selected');
    
    while($bucket[0]) {
        $bucket.addClass('selected');
        $bucket = $bucket.next();
    }
    this.metric.buckets.forEach(function(bucket) {
        bucket.selected = false;
    })
    this.metric.buckets[ord].selected = true;
};
//
// $.MetricBox.prototype.deselectPercentile = function(ord, $bucket) {
//     while($bucket[0]) {
//         $bucket.removeClass('selected');
//         $bucket = $bucket.prev();
//     }
//     this.metric.buckets[ord] = false;
// };

$.MetricBox.prototype.buildPercentile = function(bucket, idx) {
    var $bucket = $('<div class="bucket align-children-middle">');
    $bucket.data('ord', idx);
    
    if (bucket['selected']) $bucket.addClass('selected');
    $bucket.text(bucket['name']);
    
    this.$buckets.prepend($bucket);  
};

$.fn.metricBox = function(metric, query) {
    return this.each(function () {
        new $.MetricBox(this, metric, query);
    });
};