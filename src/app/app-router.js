angular.module('app').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/order');

	$stateProvider
		.state('root', {
			url: '',
			templateUrl: 'app/views/app-views.html'
		})

		.state('root.order', {
			url: '/order',
			phase: 'order',
			views: {
				'header' : {
					templateUrl: 'app/views/header-footer/header/order/order-header-view.html',
					css: 'app/views/header-footer/header/order/order-header-styles.css'
				},
				'content' : {
					templateUrl: 'app/views/order/order-view.html',
					controller: 'orderController',
					css: 'app/views/order/order-styles.css'
				},
				'footer' : {
					templateUrl: 'app/views/header-footer/footer/order/order-footer-view.html',
					css: 'app/views/header-footer/footer/footer-styles.css'
				}
			}
			
		})

		.state('root.customize-item-order', {
			url: '/customize-item-order/{menuIndex}',
			phase: 'order',
			views: {
				'header' : {
					templateUrl: 'app/views/header-footer/header/order/order-header-view.html',
					css: 'app/views/header-footer/header/order/order-header-styles.css'
				},
				'content' : {
					templateUrl: 'app/views/customize-item/customize-item-order/customize-item-order-view.html',
					controller: 'customizeItemOrderController',
					css: 'app/views/customize-item/customize-item-order/customize-item-order-styles.css'
				},
				'footer' : {
					templateUrl: 'app/views/header-footer/footer/order/order-footer-view.html',
					css: 'app/views/header-footer/footer/footer-styles.css'
				}
			}
		})

		.state('root.checkout', {
			url: '/checkout',
			phase: 'checkout',
			views: {
				'header' : {
					templateUrl: 'app/views/header-footer/header/checkout/checkout-header-view.html',
					css: 'app/views/header-footer/header/checkout/checkout-header-styles.css'
				},
				'content' : {
					templateUrl: 'app/views/checkout/checkout-view.html',
					controller: 'checkoutController'
				},
				'footer' : {
					templateUrl: 'app/views/header-footer/footer/checkout/checkout-footer-view.html',
					css: 'app/views/header-footer/footer/footer-styles.css'
				}
			}
		});
});