(function(root, undefined) {
    var app = root.app = (root.app || {});
    
    var models = app.models = (app.models || {});
    
    var Report = models.Report = function(blob) {
        for(var metric in Report.metrics) {
            this.setMetric(metric, blob[metric]);
        }
    };
    
    var QueryMaker = app.QueryMaker = function($el) {
        this.$el = $el;
        this.$activeMetrics = this.$el.find('.active-metrics');
        this.$inactiveMetrics = this.$el.find('.inactive-metrics');
        this.$bizList = this.$el.find('.biz-list');
        this.$makeQuery = this.$el.find('.make-query');
        
        this.metrics = {};
        
        this.$el.on('activateMetric', this.activateMetric.bind(this));
        this.$el.on('deactivateMetric', this.deactivateMetric.bind(this));
 //TODO: Disabled on-click firing.       // this.$makeQuery.on('click', this.makeRequest.bind(this));
        
        this.getDefaultMetrics();
        this.drawStartingQuery();
    };

    QueryMaker.prototype.getDefaultMetrics = function() {
        Report.BASIC_METRICS.forEach(function(metric) {
            this.metrics[metric] = Report.METRICS[metric];
        }.bind(this));
    };
    
    QueryMaker.prototype.drawStartingQuery = function() {
        for(var metricKey in this.metrics) {
            var $metric = $('<div class="metric">');
            $metric.data('key', metricKey);
            $metric.metricBox(this.metrics[metricKey], this);
        }
    };
    
    QueryMaker.prototype.activateMetric = function(evt, $metric) {  
        this.$activeMetrics.append($metric.$el);
        var key = $metric.$el.data('key');
        this.metrics[key].active = true;
    };
    
    QueryMaker.prototype.deactivateMetric = function(evt, $metric) {
        this.$inactiveMetrics.append($metric.$el);
        var key = $metric.$el.data('key');
        this.metrics[key].active = false;
    };
    
    QueryMaker.prototype.buildParamsFromActiveMetrics = function() {
        var activeParams = [];
        for(var metricKey in this.metrics) {
            var metric = this.metrics[metricKey];
            if (metric.active) {
                metricKey = 'stock.' + metricKey + metric.type;
                var selectedBucket = null;
                metric.buckets.forEach(function(bucket) {
                    if (bucket.selected) {
                        selectedBucket = bucket;
                    }                    
                });

                if (selectedBucket) {
                    var param = {range: {}};
                    param.range[metricKey] = range = {};
                    range[selectedBucket.operand] = selectedBucket.value;
                
                    activeParams.push(param);                    
                }
            }
        }
        
        return activeParams;
    };
    
    QueryMaker.prototype.makeRequest = function() {
        var url = 'http://www.myisquared.com:9200/stockpicks/_search';
        var musts = this.buildParamsFromActiveMetrics();
        var data = {
            query: {
                bool: {
                    must: musts,
                    must_not:[],
                    should:[],
                }
            },
            from: 0,
            size: 10,
            sort: [],
            facets: {}
        };
        
        var view = this;
        var response = $.ajax({
            type: 'GET',
            url: url, 
            data: JSON.stringify(data),
            success: function(resp) {
                var hits = resp.hits.hits;
                view.$bizList.html('');
                hits.forEach(function(hit) {
                    var $li = view.renderCompanyListItem(hit._source)
                    view.$bizList.append($li);                    
                })
            }
        })
    };
    
    QueryMaker.prototype.renderCompanyListItem = function(company) {
        var li = [
            '<li class="company">',
            '<h3>' + company.name + ' : ' + company.symbol + '</h3>',
            '<span>sector: ' + company.sector + '</span><br>',
            '<span>industry: ' + company.industry + '</span>',
            '</li>'
        ];
        return $(li.join(''));
    };
    
    Report.BASIC_METRICS = [
        "total_current_assets",
        "total_current_liabilities",
        "current_ratio",
        'goodwill',
        'net_income',
        'fixed_assets',
        'total_assets',
        'total_equity',
        'financial_leverage_ratio',
        'liabilities'
    ]
    
    Report.ATTRIBUTES = [
        "industry",
        "name",
        "symbol",
        "sector",
        "timestamp"
    ];
    
    Report.METRICS = {
        "total_current_assets": {
            name: 'total current assets',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "financial_leverage_ratio": {
            name: 'financial leverage ratio',
            type: '',
            buckets: [
                {
                    name: '<1.5',
                    operand: 'lt',
                    value: 1.5,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '>1.5',
                    operand: 'gt',
                    value: 1.5,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "total_current_liabilities": {
            name: 'total current liabilities',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "current_ratio": {
            name: 'current ratio',
            type: '',
            buckets: [
                {
                    name: '<1',
                    operand: 'lt',
                    value: '1',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '>1',
                    operand: 'gt',
                    value: '1',
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "short-term_investments": {
            name: 'short term investments',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "capital_surplus": {
            name: 'capital surplus',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "liabilities": {
            name: 'liabilities',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_liabilities": {
            name: 'other liabilities',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "fixed_assets": {
            name: 'fixed assets',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "income_tax": {
            name: 'income tax',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "common_stocks": {
            name: 'common stocks',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "accounts_payable": {
            name: 'accounts payable',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_income-cont._operations": {
            name: 'net income cont. operations',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_current_assets": {
            name: 'other current assets',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "deferred_liability_charges": {
            name: 'deferred liability charges',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_financing_activities": {
            name: 'other financing activities',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "add'l_income/expense_items": {
            name: 'additional income / expense items',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "misc._stocks": {
            name: 'misc. stocks',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_cash_flow-operating": {
            name: 'net operating cash flow',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "minority_interest": {
            name: 'minority interest',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "sale_and_purchase_of_stock": {
            name: 'stock sales / purchases',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "retained_earnings": {
            name: 'retained earnings',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_income": {
            name: 'net income',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "long-term_debt": {
            name: 'long-term debt',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "total_equity": {
            name: 'total equity',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "total_revenue": {
            name: 'total revenue',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "inventory": {
            name: 'inventory',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_investing_activities": {
            name: 'other investing activities',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "total_liabilities_&_equity": {
            name: 'total liabilities & equity',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "earnings_before_interest_and_tax": {
            name: 'earnings before interest and tax',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "equity_earnings/loss_unconsolidated_subsidiary": {
            name: 'equity earnings / loss unconsolidated subsidiary',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "non-recurring_items": {
            name: 'non-recurring items',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "accounts_receivable": {
            name: 'accounts receivable',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "intangible_assets": {
            name: 'intangible assets',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_borrowings": {
            name: 'net borrowings',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "interest_expense": {
            name: 'interest expense',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "operating_income": {
            name: 'operating income',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_assets": {
            name: 'other assets',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "short-term_debt_/_current_portion_of_long-term_debt": {
            name: 'short-term debt / current portion of long-term debt',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_income_applicable_to_common_shareholders": {
            name: 'net income applicable to common shareholders',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_equity": {
            name: 'other equity',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_operating_items": {
            name: 'other operating items',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "cash_and_cash_equivalents": {
            name: 'cash and cash equivalents',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_cash_flows-financing": {
            name: 'net cash flows (financing)',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "deferred_asset_charges": {
            name: 'deferred asset charges',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_current_liabilities": {
            name: 'other current liabilities',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "total_liabilities": {
            name: 'total liabilities',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "cost_of_revenue": {
            name: 'cost of revenue',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "research_and_development": {
            name: 'research and development',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "total_assets": {
            name: 'total assets',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "sales,_general_and_admin": {
            name: 'sales (general and admin)',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "goodwill": {
            name: 'goodwill',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "changes_in_inventories": {
            name: 'changes in inventories',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "effect_of_exchange_rate": {
            name: 'effect of exchange rate',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "other_operating_activities": {
            name: 'other operating activities',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "gross_profit": {
            name: 'gross profit',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_receivables": {
            name: 'net receivables',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_cash_flow": {
            name: 'net cash flow',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "capital_expenditures": {
            name: 'capital expenditures',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_cash_flows-investing": {
            name: 'net cash flows (investing)',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "net_income_adjustments": {
            name: 'net income adjustments',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "depreciation": {
            name: 'depreciation',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "earnings_before_tax": {
            name: 'earnings before tax',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "investments": {
            name: 'investments',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "treasury_stock": {
            name: 'treasury stock',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        },
        "long-term_investments": {
            name: 'long term investments',
            type: '_percentile',
            buckets: [
                {
                    name: '20%',
                    operand: 'gt',
                    value: 20,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    operand: 'gt',
                    value: 40,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    operand: 'gt',
                    value: 60,
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    operand: 'gt',
                    value: 80,
                    selected: false,
                    tooltip: ''
                }
            ],
            active: true,
            tooltip: '',
        }
    };
})(this);