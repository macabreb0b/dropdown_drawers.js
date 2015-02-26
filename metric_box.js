$.MetricBox = function(el, metric) {
    this.$el = $(el);
    
    this.$nameBlock = $('<div class="name-block align-children-middle">');
    this.$el.append(this.$nameBlock);
    
    this.$drawer = $('<div class="drawer">');
    this.$handle = $('<div class="handle">=</div>');
    this.$drawer.append(this.$handle);
    
    this.$percentiles = $('<div class="percentiles">');
    this.$drawer.append(this.$percentiles);
    
    this.$el.append(this.$drawer);
    
    this.$nameBlock.click(this.toggleSlide.bind(this))
    this.$handle.click(this.toggleSlide.bind(this));
    this.$percentiles.on('click', '.percentile', this.toggleSelection.bind(this));
    
    this.revealed = false;
    
    if (metric !== undefined) {
        this.setMetric(metric);
    }
};

$.MetricBox.percentileColors = [
    
];

$.MetricBox.prototype.setMetric = function(metric) {
    this.clearState();
    
    this.metric = metric;
    var name = $('<span>')
    name.text(metric['name']);
    this.$nameBlock.append(name);
    this.buildPercentiles();
};

$.MetricBox.prototype.clearState = function() {
    this.$nameBlock.html('');
    this.$el.find('.percentile').remove();
}

$.MetricBox.prototype.toggleSlide = function() {
    if (this.revealed) {
        this.slideDown();
    } else {
        this.slideUp();
    }
};

$.MetricBox.prototype.slideDown = function() {
    this.$drawer.css('top', '-20px')
    this.revealed = false;
};

$.MetricBox.prototype.slideUp = function() {
    var len = this.metric['percentiles'].length;
    var newTop = ((len * 50) + 20) * -1;
    this.$drawer.css('top', newTop + 'px');
    this.$drawer.addClass('open');
    this.revealed = true;
};

$.MetricBox.prototype.buildPercentiles = function() {
    var percentiles = this.metric['percentiles'];
    for (var i = 0; i < percentiles.length; i++) {
        var percentile = percentiles[i];
        this.buildPercentile(percentile, i);
    }
};



$.MetricBox.prototype.toggleSelection = function(event) {
    var $target = $(event.currentTarget);
    var ord = $target.data('ord');
    var percentile = this.metric['percentiles'][ord];

    if (percentile.selected) {
        this.deselectPercentile(percentile, $target);
    } else {
        this.selectPercentile(percentile, $target);
    }
};

$.MetricBox.prototype.selectPercentile = function(percentile, $percentile) {
    $percentile.addClass('selected');
    percentile.selected = true;
};

$.MetricBox.prototype.deselectPercentile = function(percentile, $percentile) {
    $percentile.removeClass('selected');
    percentile.selected = false;
};

$.MetricBox.prototype.buildPercentile = function(percentile, idx) {
    var $percentile = $('<div class="percentile align-children-middle">');
    $percentile.data('ord', idx);
    
    if (percentile['selected']) $percentile.addClass('selected');
    $percentile.text(percentile['name']);
    
    this.$percentiles.prepend($percentile);  
};

$.fn.metricBox = function(metric) {
    return this.each(function () {
        new $.MetricBox(this, metric);
    });
};