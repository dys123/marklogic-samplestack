var util = require('util');

function PageBase () {
  var self = this;
  var returnNull = function () { return null; };

  Object.defineProperty(this, 'pageTitle', {
    get: function () {
      return browser.getTitle();
    }
  });

  Object.defineProperty(this, 'loginElement', {
    get: function () {
      return element(by.css('.ss-login a'));
    }
  });

  this.loginStart = function () {
    return self.loginElement.click().then(returnNull);
  };

  this.loginCancel = function () {
    return element(by.css('.ss-dialog-login .ss-button-cancel')).click()
        .then(returnNull);
  };

  Object.defineProperty(this, 'loginSubmitButton', {
    get: function () {
      return element(by.css('.ss-button-submit'));
    }
  });

  this.loginSubmit = function () {
    return self.loginSubmitButton.click().then(returnNull);
  };

  Object.defineProperty(this, 'loginSubmitEnabled', {
    get: function () {
      return self.loginSubmitButton.isEnabled();
    }
  });

  Object.defineProperty(this, 'loginUserNameElement', {
    get: function () {
      return element(by.className('ss-input-username'));
    }
  });

  Object.defineProperty(this, 'loginPasswordElement', {
    get: function () {
      return element(by.className('ss-input-password'));
    }
  });

  this.loginEnterUserName = function (userName) {
    return self.loginUserNameElement
      .clear()
      .sendKeys(userName)
      .then(returnNull);
  };

  this.loginEnterPassword = function (password) {
    return self.loginPasswordElement
    .clear()
    .sendKeys(password)
    .then(returnNull);
  };

  Object.defineProperty(this, 'loginFailedMessage', {
    get: function () {
      return element(by.css('.ss-dialog-login .login-failed'));
    }
  });

  Object.defineProperty(this, 'loginIsDenied', {
    get: function () {
      var msg = self.loginFailedMessage;
      return msg.isDisplayed().then(
        function (isVisible) {
          return isVisible && msg.getText().then(
            function (text) {
              return text.indexOf('Unauthorized') >= 0;
            }
          );
        }
      );
    }
  });


  this.login = function (userName, password) {
    return self.loginStart()
    .then(self.loginEnterUserName.bind(self, userName))
    .then(self.loginEnterPassword.bind(self, password))
    .then(self.loginSubmit);
  };

  Object.defineProperty(this, 'accountInfoElement', {
    get: function () {
      return element(by.className('ss-user-info-display-name-reputation'));
    }
  });

  Object.defineProperty(this, 'accountInfoLabel', {
    get: function () {
      return self.accountInfoElement.getText();
    }
  });

  Object.defineProperty(this, 'userReputation', {
    get: function () {
      return self.accountInfoLabel.then(
        function (label) {
          return parseInt(label.match(/[^\[]*\[([^\]]*)\]/));
        }
      );
    }
  });

  Object.defineProperty(this, 'userName', {
    get: function () {
      return self.accountInfoLabel.then(
        function (label) {
          return label.replace(/ \[.*$/, '');
        }
      );
    }
  });

  Object.defineProperty(this, 'isLoggedIn', {
    get: function () {
      return self.userName.then(
        function () { return true; },
        function () { return false; }
      );
    }
  });


  this.accountDropdownOpen = function () {
    return self.accountInfoLabel.click().then(returnNull);
  };

  Object.defineProperty(this, 'logoutButton', {
    get: function () {
      return element(by.css('.ss-account-dropdown button'));
    }
  });

  this.logout = function () {
    return self.accountDropdownOpen().then(self.logoutButton.click)
      .then(returnNull);
  };

  this.loginIfNecessary = function (userName, password) {
    return this.userName.then(
      function (name) {
        var before = name ? self.logout : null;
        return q.when(before, self.login.bind(self, userName, password))
            .then(returnNull);
      }
    );
  };

  this.logoutIfNecessary = function () {
    return self.isLoggedIn.then(
      function (isLoggedIn) {
        if (isLoggedIn) {
          return self.logout();
        }
        else {
          return;
        }
      }
    );
  };
}

PageBase.instantiate = function (Page) {
  util.inherits(Page, PageBase);
  return new Page();
};

module.exports = PageBase;