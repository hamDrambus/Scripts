document.domain = 'oszone.net';

var oauth_opened_window;

var oauth_path = 'http://forum.oszone.net/social/';

var oauth_params = [
	['vkontakte', 'vk60.png'],
//	['facebook', 'fb60.png'],
	['twitter', 'twitt60.png']
];


var _o_op = function (s)
{
	if (!_get_item())
	{
		var y_n = window.confirm(
			'Если это Ваш первый вход через социальную сеть, '+
			'мы создадим для Вас новый профиль.\n\n'+
			'Уже существующий на OSZone профиль нужно связать с социальными сетями.\n'+
			'Чтобы сделать это, нажмите Cancel/Отмена и войдите с учетной записью OSZone.\n\n'+
			'Для входа с учетной записью социальной сети нажмите ОК.'
		);

		/* 'Напоминаем, что существует возможность привязки профиля OSZone.net и соц. сети\n'+
			'Если вы уже зарегистрированы на oszone, рекомендуем осуществить привязку.\n\n'+
			'В противном случае создастся новый профиль, и Вы потеряете возможность такой привязки.\n\n'+
			'Для продолжения нажмите OK, для отмены - Cancel/Отмена.' */

		_stor_item();

		if (!y_n) return;
	}

	_winopen(oauth_path + 'oauth.php?social=' + s + '&proc=login');

};



var _winopen = function (url, title, top, left, width, height)
{
	var title = title || 'oauth_OSZone';
	var top = top || 150;
	var left = left || 350;
	var width = width || 600;
	var height = height || 400;

	oauth_opened_window = window.open(url, title, 'top='+top+', left='+left+', menubar=0,'+
	'toolbar=0, location=1, directories=1,'+
	'status=0, scrollbars=1, resizable=0,'+
	'width='+width+', height='+height);
};



var _get_item = function ()
{
	if (window.localStorage)
	{
		return window.localStorage.getItem('cfd')? true: false;
	}
	else
	{
		return false;
	}
};



var _stor_item = function ()
{
	if (window.localStorage)
	{
		window.localStorage.setItem('cfd', 1);
	}
};


var _write_l = function (s, i)
{
	return '<a title="Войти с учетной записью ' + s + '" href="javascript:void(_o_op(\'' + s + '\'))">' +
		'<img alt="Войти с учетной записью ' + s + '" src="' +
		oauth_path + 'img/' + i + '" width="60" height="18" border="0" style="margin-top: 5" />' +
		'</a>';
};


var _write_o_links = function ()
{
	var txt = '';

	var a = [];

	for (var i = 0; i < oauth_params.length; i++)
	{
		a[i] = _write_l(oauth_params[i][0], oauth_params[i][1]);
	}

	txt = ''+
	'' + a.join('&nbsp;') + ''+
	'';

	document.write(txt);
};



if (document.cookie) _write_o_links();
