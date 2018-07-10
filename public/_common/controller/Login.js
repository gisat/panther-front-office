Ext.define('Puma.controller.Login', {
    extend: 'Ext.app.Controller',
    views: [],
    requires: ['Ext.window.MessageBox','Puma.view.LoginWindow'],
    init: function() {
        this.control({
            'loginheader': {
                loginclick: this.onLoginClicked,
                logoutclick: this.onLogoutClicked,
				administrationclick: this.onAdministrationClicked
            },
            'loginwindow #loginbtn': {
                click: this.onLoginSubmit
            }
        })
		$('.user .administration').attr('href', Config.backOfficeUrl);
		this.checkLogin();
        var me = this
        $('.login').click(function() {
            me.onLoginClicked();
        })
        $('.signup').click(function() {
            if ($(this).html()==polyglot.t('logOut')) {
                me.onLogoutClicked();
            }
            else {
                window.open(Config.signupAddress, "_blank")
            }
        })
    },
    onLoginClicked: function(btn, hideCancelButton) {
        var window = Ext.WindowManager.get('loginwindow');
        if (!window) {
            window = Ext.widget('loginwindow', {
                id: 'loginwindow'
            })
        }
        Ext.ComponentQuery.query('#password',window)[0].setValue('');
        Ext.ComponentQuery.query('#cancelbtn')[0].setVisible(!hideCancelButton);

        window.show();

        setTimeout(function(){
			$(".login-username input").focus();
        },50)
    },

    onLoginSubmit: function(btn) {
        var form = btn.up('form');
        var userName = form.getComponent('username').getValue();
        var pass = form.getComponent('password').getValue();
        var me = this;
        Ext.Ajax.request({
            url: Config.url+'api/login/login',
            params: {
                username: userName,
                password: pass
            },
            success: function(response) {
                me.checkLogin(true)
            },
            failure: function(error) {
                alert(polyglot.t("incorrectLogin"));
            }
        })
    },
    
    onLogoutClicked: function() {
        var me = this;
        Ext.Ajax.request({
            url: Config.url+'api/login/logout',
            method: 'POST',
            success: function(response) {
                Config.auth = null;

                if(!new URL(window.location).searchParams.get('needLogin')) {
                    me.onChangeLoginState(false);
                } else {
					me.onChangeLoginState(false);
					window.location = window.location.origin + window.location.pathname;
                }
            }
        })
    },
    checkLogin: function(fromLogin) {
        var me = this;
        Ext.Ajax.request({
            url: Config.url+'api/login/getLoginInfo',
            method: 'POST',
            success: function(response) {
                var response = JSON.parse(response.responseText);
                if (fromLogin && !response.data) {
                    Ext.Msg.alert(polyglot.t('error'), polyglot.t('badCredentials'));
                    Ext.ComponentQuery.query('loginwindow #password')[0].setValue('');
                    return;
                }
                Config.auth = response.data || null;
                me.onChangeLoginState(response.data ? true : false);
            }
        })
    },
    onChangeLoginState: function(loggedIn) {

        var cmp = Ext.ComponentQuery.query('loginheader #logintext')[0]
        if (!cmp) {
            var window = Ext.WindowManager.get('loginwindow');
            if (window) {
                window.close();
            }
            $('.login').html(Config.auth ? Config.auth.userName : polyglot.t('logIn'));
            $('.signup').html(Config.auth ? polyglot.t('logOut') : polyglot.t('signUp'));

            if ($('.signup').html() == polyglot.t("logIn")){
                $('.signup, .login').addClass("logged");
				$('.user .sep').css("display","inline-block");
            }
            else {
                $('.signup, .login').removeClass("logged");
				$('.user .sep').css("display","none");
            }

            if(loggedIn) {
                if(!Config.toggles.disableAdministration) {
					$('#bo-link').show();
				}
				$('#top-toolbar-saved-views').removeClass('hidden');
            } else {
				$('#bo-link').hide();
				$('#top-toolbar-saved-views').addClass('hidden');
            }

            this.application.fireEvent('login', loggedIn);
            return;
        }
        var text = polyglot.t('notLoggedIn');
        if (loggedIn) {
			text = polyglot.t('loggedInAs') + Config.auth.userName;
			var window = Ext.WindowManager.get('loginwindow');
			if (window) {
				window.close();
			}

			$('#bo-link').show();
		} else {
            $('#bo-link').hide();
        }

        Ext.ComponentQuery.query('loginheader #logintext')[0].update(text);
        Ext.ComponentQuery.query('loginheader #loginbtn')[0].setVisible(!loggedIn);
        Ext.ComponentQuery.query('loginheader #logoutbtn')[0].setVisible(loggedIn);
		this.application.fireEvent('login', loggedIn);
    }
});


