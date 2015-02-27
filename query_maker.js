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
        this.metrics = {};
        
        this.$el.on('activateMetric', this.activateMetric.bind(this));
        this.$el.on('deactivateMetric', this.deactivateMetric.bind(this));
        
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
    
    QueryMaker.prototype.buildQueryFromActiveMetrics = function() {};
    
    QueryMaker.prototype.makeRequest = function() {};
    
    Report.BASIC_METRICS = [
        "total_current_assets",
        "total_current_liabilities",
        "current_ratio"
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
            buckets: [
                {
                    name: '20%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '100%',
                    selected: false,
                    tooltip: ''
                },
            ],
            active: false,
            tooltip: '',
        },
        "total_current_liabilities": {
            name: 'total current liabilities',
            buckets: [
                {
                    name: '20%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '100%',
                    selected: false,
                    tooltip: ''
                },
            ],
            active: true,
            tooltip: '',
        },
        "current_ratio": {
            name: 'current ratio',
            buckets: [
                {
                    name: '20%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '40%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '60%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '80%',
                    selected: false,
                    tooltip: ''
                },
                {
                    name: '100%',
                    selected: false,
                    tooltip: ''
                },
            ],
            active: true,
            tooltip: '',
        },
        "short-term_investments": {
            name: 'short term investments',
            buckets: [
            ],
            active: true,
            tooltip: '',
        },
        "capital_surplus": {
            name: 'capital surplus',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "liabilities": {
            name: 'liabilities',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_liabilities": {
            name: 'other liabilities',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "fixed_assets": {
            name: 'fixed assets',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "income_tax": {
            name: 'income tax',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "common_stocks": {
            name: 'common stocks',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "accounts_payable": {
            name: 'accounts payable',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_income-cont._operations": {
            name: 'net income cont. operations',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_current_assets": {
            name: 'other current assets',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "deferred_liability_charges": {
            name: 'deferred liability charges',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_financing_activities": {
            name: 'other financing activities',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "add'l_income/expense_items": {
            name: 'additional income / expense items',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "misc._stocks": {
            name: 'misc. stocks',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_cash_flow-operating": {
            name: 'net operating cash flow',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "minority_interest": {
            name: 'minority interest',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "sale_and_purchase_of_stock": {
            name: 'stock sales / purchases',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "retained_earnings": {
            name: 'retained earnings',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_income": {
            name: 'net income',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "long-term_debt": {
            name: 'long-term debt',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "total_equity": {
            name: 'total equity',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "total_revenue": {
            name: 'total revenue',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "inventory": {
            name: 'inventory',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_investing_activities": {
            name: 'other investing activities',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "total_liabilities_&_equity": {
            name: 'total liabilities & equity',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "earnings_before_interest_and_tax": {
            name: 'earnings before interest and tax',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "equity_earnings/loss_unconsolidated_subsidiary": {
            name: 'equity earnings / loss unconsolidated subsidiary',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "non-recurring_items": {
            name: 'non-recurring items',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "accounts_receivable": {
            name: 'accounts receivable',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "intangible_assets": {
            name: 'intangible assets',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_borrowings": {
            name: 'net borrowings',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "interest_expense": {
            name: 'interest expense',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "operating_income": {
            name: 'operating income',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_assets": {
            name: 'other assets',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "short-term_debt_/_current_portion_of_long-term_debt": {
            name: 'short-term debt / current portion of long-term debt',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_income_applicable_to_common_shareholders": {
            name: '',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_equity": {
            name: 'other equity',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_operating_items": {
            name: 'other operating items',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "cash_and_cash_equivalents": {
            name: 'cash and cash equivalents',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_cash_flows-financing": {
            name: 'net cash flows (financing)',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "deferred_asset_charges": {
            name: 'deferred asset charges',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_current_liabilities": {
            name: 'other current liabilities',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "total_liabilities": {
            name: 'total liabilities',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "cost_of_revenue": {
            name: 'cost of revenue',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "research_and_development": {
            name: 'research and development',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "total_assets": {
            name: 'total assets',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "sales,_general_and_admin": {
            name: 'sales (general and admin)',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "goodwill": {
            name: 'goodwill',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "changes_in_inventories": {
            name: 'changes in inventories',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "effect_of_exchange_rate": {
            name: 'effect of exchange rate',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "other_operating_activities": {
            name: 'other operating activities',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "gross_profit": {
            name: 'gross profit',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_receivables": {
            name: 'net receivables',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_cash_flow": {
            name: 'net cash flow',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "capital_expenditures": {
            name: 'capital expenditures',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_cash_flows-investing": {
            name: 'net cash flows (investing)',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "net_income_adjustments": {
            name: 'net income adjustments',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "depreciation": {
            name: 'depreciation',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "earnings_before_tax": {
            name: 'earnings before tax',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "investments": {
            name: 'investments',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "treasury_stock": {
            name: 'treasury stock',
            buckets: [],
            active: true,
            tooltip: '',
        },
        "long-term_investments": {
            name: 'long term investments',
            buckets: [],
            active: true,
            tooltip: '',
        }
    };
})(this);