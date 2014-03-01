"use strict";

/**
 * Created with JetBrains WebStorm.
 * User: Dmitry.Shahtanov
 * Date: 27.06.13
 * Time: 13:24
 * To change this template use File | Settings | File Templates.
 */
function GetDiffDate360( nDay1, nMonth1, nYear1, bLeapYear1, nDay2, nMonth2, nYear2, bUSAMethod ) {
    if ( nDay1 == 31 )
        nDay1--;
    else if ( bUSAMethod && ( nMonth1 == 2 && ( nDay1 == 29 || ( nDay1 == 28 && !bLeapYear1 ) ) ) )
        nDay1 = 30;

    if ( nDay2 == 31 ) {
        if ( bUSAMethod && nDay1 != 30 ) {
            nDay2 = 1;
            if ( nMonth2 == 12 ) {
                nYear2++;
                nMonth2 = 1;
            }
            else
                nMonth2++;
        }
        else
            nDay2 = 30;
    }

    return nDay2 + nMonth2 * 30 + nYear2 * 360 - nDay1 - nMonth1 * 30 - nYear1 * 360;
}
cFormulaFunction.DateAndTime = {
    'groupName':"DateAndTime",
    'DATE':cDATE,
    'DATEDIF':cDATEDIF,
    'DATEVALUE':cDATEVALUE,
    'DAY':cDAY,
    'DAYS360':cDAYS360,
    'EDATE':cEDATE,
    'EOMONTH':cEOMONTH,
    'HOUR':cHOUR,
    'MINUTE':cMINUTE,
    'MONTH':cMONTH,
    'NETWORKDAYS':cNETWORKDAYS,
    'NETWORKDAYS.INTL':cNETWORKDAYS_INTL,
    'NOW':cNOW,
    'SECOND':cSECOND,
    'TIME':cTIME,
    'TIMEVALUE':cTIMEVALUE,
    'TODAY':cTODAY,
    'WEEKDAY':cWEEKDAY,
    'WEEKNUM':cWEEKNUM,
    'WORKDAY':cWORKDAY,
    'WORKDAY.INTL':cWORKDAY_INTL,
    'YEAR':cYEAR,
    'YEARFRAC':cYEARFRAC
}

function cDATE() {
//    cBaseFunction.call( this, "DATE" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "DATE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cDATE.prototype = Object.create( cBaseFunction.prototype )
cDATE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], year, month, day;

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElement( 0 );
    }
    if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof cArray ) {
        arg2 = arg2.getElement( 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg0 instanceof cError )    return this.setCA( arg0, true );
    if ( arg1 instanceof cError )    return this.setCA( arg1, true );
    if ( arg2 instanceof cError )    return this.setCA( arg2, true );

    year = arg0.getValue();
    month = arg1.getValue();
    day = arg2.getValue();

    if ( year >= 0 && year <= 1899 )
        year += 1900;
    if ( month == 0 ) {
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    }
    this.value = new cNumber( Math.round( new Date( year, month - 1, day ).getExcelDate() ) )
    this.value.numFormat = 14;
    this.value.ca = true;
    return this.value;
}
cDATE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( year, month, day )"
    };
}

function cDATEDIF() {
//    cBaseFunction.call( this, "DATEDIF" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "DATEIF";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDATEDIF.prototype = Object.create( cBaseFunction.prototype )
cDATEDIF.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2];
    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof cArray ) {
        arg2 = arg2.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocString();

    if ( arg0 instanceof cError ) return this.value = arg0;
    if ( arg1 instanceof cError ) return this.value = arg1;
    if ( arg2 instanceof cError ) return this.value = arg2;

    var val0 = arg0.getValue(), val1 = arg1.getValue();

    if ( val0 < 0 || val1 < 0 || val0 >= val1 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );

    val0 = Date.prototype.getDateFromExcel( val0 );
    val1 = Date.prototype.getDateFromExcel( val1 );

    function dateDiff( date1, date2 ) {
        var years = date2.getFullYear() - date1.getFullYear();
        var months = years * 12 + date2.getMonth() - date1.getMonth();
        var days = date2.getDate() - date1.getDate();

        years -= date2.getMonth() < date1.getMonth();
        months -= date2.getDate() < date1.getDate();
        days += days < 0 ? new Date( date2.getFullYear(), date2.getMonth() - 1, 0 ).getDate() + 1 : 0;

        return [ years, months, days ];
    }

    switch ( arg2.getValue().toUpperCase() ) {
        case "Y":
            return this.value = new cNumber( dateDiff( val0, val1 )[0] );
            break;
        case "M":
            return this.value = new cNumber( dateDiff( val0, val1 )[1] );
            break;
        case "D":
            return this.value = new cNumber( parseInt( (val1 - val0) / c_msPerDay ) );
            break;
        case "MD":
            if ( val0.getDate() > val1.getDate() ) {
                this.value = new cNumber( Math.abs( new Date( val0.getFullYear(), val0.getMonth(), val0.getDate() ) - new Date( val0.getFullYear(), val0.getMonth() + 1, val1.getDate() ) ) / c_msPerDay );
            }
            else {
                this.value = new cNumber( val1.getDate() - val0.getDate() );
            }
            return this.value;
            break;
        case "YM":
            var d = dateDiff( val0, val1 );
            return this.value = new cNumber( d[1] - d[0] * 12 );
            break;
        case "YD":
            if ( val0.getMonth() > val1.getMonth() ) {
                this.value = new cNumber( Math.abs( new Date( val0.getFullYear(), val0.getMonth(), val0.getDate() ) - new Date( val0.getFullYear() + 1, val1.getMonth(), val1.getDate() ) ) / c_msPerDay );
            }
            else {
                this.value = new cNumber( Math.abs( new Date( val0.getFullYear(), val0.getMonth(), val0.getDate() ) - new Date( val0.getFullYear(), val1.getMonth(), val1.getDate() ) ) / c_msPerDay );
            }
            return this.value;
            break;
        default:
            return this.value = new cError( cErrorType.not_numeric )
    }

}
cDATEDIF.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( start-date , end-date , unit )"
    };
}

function cDATEVALUE() {
//    cBaseFunction.call( this, "DATEVALUE" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "DATEVALUE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDATEVALUE.prototype = Object.create( cBaseFunction.prototype )
cDATEVALUE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocString();

    if ( arg0 instanceof cError )
        return this.value = arg0;

    if ( arg0.tocNumber() instanceof cNumber && arg0.tocNumber().getValue() > 0 )
        return this.value = new cNumber( parseInt( arg0.tocNumber().getValue() ) );

    var res = g_oFormatParser.parse( arg0.getValue() );

    if ( res && res.bDateTime )
        return this.value = new cNumber( parseInt( res.value ) );
    else
        return this.value = new cError( cErrorType.wrong_value_type );
}
cDATEVALUE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( date-time-string )"
    };
}

function cDAY() {
//    cBaseFunction.call( this, "DAY" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "DAY";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDAY.prototype = Object.create( cBaseFunction.prototype )
cDAY.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], val;
    if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocNumber();
        val = arg0.tocNumber().getValue();
    }
    if ( arg0 instanceof cError ) return this.setCA( arg0, true );
    else if ( arg0 instanceof cNumber || arg0 instanceof cBool ) {
        val = arg0.tocNumber().getValue();
    }
    else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ) {
        val = arg0.getValue().tocNumber();
        if ( val instanceof cNumber || val instanceof cBool ) {
            val = arg0.tocNumber().getValue();
        }
        else {
            return this.setCA( new cError( cErrorType.wrong_value_type ), true );
        }
    }
    else if ( arg0 instanceof cString ) {
        val = arg0.tocNumber();
        if ( val instanceof cError || val instanceof cEmpty ) {
            var d = new Date( arg0.getValue() );
            if ( isNaN( d ) ) {
                return this.setCA( new cError( cErrorType.wrong_value_type ), true );
            }
            else
                val = Math.floor( ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay + ( c_DateCorrectConst + (g_bDate1904 ? 0 : 1) ) );
        }
        else {
            val = arg0.tocNumber().getValue();
        }
    }
    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else if ( !g_bDate1904 ) {
        if ( val < 60 )
            return this.setCA( new cNumber( ( new Date( (val - c_DateCorrectConst) * c_msPerDay ) ).getUTCDate() ), true, 0 );
        else if ( val == 60 )
            return this.setCA( new cNumber( ( new Date( (val - c_DateCorrectConst - 1) * c_msPerDay ) ).getUTCDate() + 1 ), true, 0 );
        else
            return this.setCA( new cNumber( ( new Date( (val - c_DateCorrectConst - 1) * c_msPerDay ) ).getUTCDate() ), true, 0 );
    }
    else
        return this.setCA( new cNumber( ( new Date( (val - c_DateCorrectConst) * c_msPerDay ) ).getUTCDate() ), true, 0 );
}
cDAY.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( date-value )"
    };
}

function cDAYS360() {
//    cBaseFunction.call( this, "DAYS360" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "DAYS360";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cDAYS360.prototype = Object.create( cBaseFunction.prototype )
cDAYS360.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cBool( false );

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof cArray ) {
        arg2 = arg2.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocBool();

    if ( arg0 instanceof cError )return this.value = arg0;
    if ( arg1 instanceof cError )return this.value = arg1;
    if ( arg2 instanceof cError )return this.value = arg2;

    if ( arg0.getValue() < 0 )return this.value = new cError( cErrorType.not_numeric );
    if ( arg1.getValue() < 0 )return this.value = new cError( cErrorType.not_numeric );

    var date1 = Date.prototype.getDateFromExcel( arg0.getValue() ), date2 = Date.prototype.getDateFromExcel( arg1.getValue() );

    return this.value = new cNumber( GetDiffDate360( date1.getDate(), date1.getMonth() + 1, date1.getFullYear(), date1.isLeapYear(),
        date2.getDate(), date2.getMonth() + 1, date2.getFullYear(), !arg2.toBool() ) )

}
cDAYS360.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  start-date , end-date [ , method-flag ] )"
    };
}

function cEDATE() {
//    cBaseFunction.call( this, "EDATE" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "EDATE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cEDATE.prototype = Object.create( cBaseFunction.prototype )
cEDATE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1];

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof cError ) return this.value = arg0;
    if ( arg1 instanceof cError ) return this.value = arg1;

    var val = arg0.getValue(), date, _date;

    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else if ( !g_bDate1904 ) {
        if ( val < 60 )
            val = new Date( (val - c_DateCorrectConst) * c_msPerDay );
        else if ( val == 60 )
            val = new Date( (val - c_DateCorrectConst - 1) * c_msPerDay );
        else
            val = new Date( (val - c_DateCorrectConst - 1) * c_msPerDay );
    }
    else
        val = new Date( (val - c_DateCorrectConst) * c_msPerDay );

    date = new Date( val );

    if ( 0 <= date.getDate() && 28 >= date.getDate() ) {
        val = new Date( val.setMonth( val.getMonth() + arg1.getValue() ) )
    }
    else if ( 29 <= date.getDate() && 31 >= date.getDate() ) {
        date.setDate( 1 );
        date.setMonth( date.getMonth() + arg1.getValue() );
        if ( val.getDate() > (_date = date.getDaysInMonth()) ) {
            val.setDate( _date );
        }
        val = new Date( val.setMonth( val.getMonth() + arg1.getValue() ) );
    }

    return this.value = new cNumber( Math.floor( ( val.getTime() / 1000 - val.getTimezoneOffset() * 60 ) / c_sPerDay + (c_DateCorrectConst + 1) ) )
}
cEDATE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( start-date , month-offset )"
    };
}

function cEOMONTH() {
//    cBaseFunction.call( this, "EOMONTH" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "EOMONTH";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cEOMONTH.prototype = Object.create( cBaseFunction.prototype )
cEOMONTH.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1];

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof cError ) return this.value = arg0;
    if ( arg1 instanceof cError ) return this.value = arg1;

    var val = arg0.getValue(), date, _date;

    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else if ( !g_bDate1904 ) {
        if ( val < 60 )
            val = new Date( (val - c_DateCorrectConst) * c_msPerDay );
        else if ( val == 60 )
            val = new Date( (val - c_DateCorrectConst - 1) * c_msPerDay );
        else
            val = new Date( (val - c_DateCorrectConst - 1) * c_msPerDay );
    }
    else
        val = new Date( (val - c_DateCorrectConst) * c_msPerDay );

    date = new Date( val );

    val.setDate( 1 );
    val.setMonth( val.getMonth() + arg1.getValue() );
    val.setDate( val.getDaysInMonth() );

    return this.value = new cNumber( Math.floor( ( val.getTime() / 1000 - val.getTimezoneOffset() * 60 ) / c_sPerDay + (c_DateCorrectConst + 1) ) );
}
cEOMONTH.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( start-date , month-offset )"
    };
}

function cHOUR() {
//    cBaseFunction.call( this, "HOUR" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "HOUR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cHOUR.prototype = Object.create( cBaseFunction.prototype )
cHOUR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], val;
    if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocNumber();
    }

    if ( arg0 instanceof cError )return this.setCA( arg0, true );
    else if ( arg0 instanceof cNumber || arg0 instanceof cBool ) {
        val = arg0.tocNumber().getValue();
    }
    else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ) {
        val = arg0.getValue();
        if ( val instanceof cError )return this.setCA( val, true );
        else if ( val instanceof cNumber || val instanceof cBool ) {
            val = arg0.tocNumber().getValue();
        }
        else {
            return this.setCA( new cError( cErrorType.wrong_value_type ), true );
        }
    }
    else if ( arg0 instanceof cString ) {
        val = arg0.tocNumber();
        if ( val instanceof cError || val instanceof cEmpty ) {
            var d = new Date( arg0.getValue() );
            if ( isNaN( d ) ) {
                d = g_oFormatParser.parseDate( arg0.getValue() );
                if ( d == null ) {
                    return this.setCA( new cError( cErrorType.wrong_value_type ), true );
                }
                val = d.value;
            }
            else
                val = ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay + ( c_DateCorrectConst + (g_bDate1904 ? 0 : 1) );
        }
        else {
            val = arg0.tocNumber().getValue();
        }
    }
    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else                             //1		 2 3 4					   4	3		 	 					2 1
        return this.setCA( new cNumber( parseInt( ( ( val - Math.floor( val ) ) * 24 ).toFixed( cExcelDateTimeDigits ) ) ), true, 0 );
}
cHOUR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( time-value )"
    };
}

function cMINUTE() {
//    cBaseFunction.call( this, "MINUTE" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "MINUTE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cMINUTE.prototype = Object.create( cBaseFunction.prototype )
cMINUTE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], val;
    if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocNumber();
    }

    if ( arg0 instanceof cError ) return this.setCA( arg0, true );
    else if ( arg0 instanceof cNumber || arg0 instanceof cBool ) {
        val = arg0.tocNumber().getValue();
    }
    else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ) {
        val = arg0.getValue();
        if ( val instanceof cError ) return this.setCA( val, true );
        else if ( val instanceof cNumber || val instanceof cBool ) {
            val = arg0.tocNumber().getValue();
        }
        else {
            return this.setCA( new cError( cErrorType.wrong_value_type ), true );
        }
    }
    else if ( arg0 instanceof cString ) {
        val = arg0.tocNumber();
        if ( val instanceof cError || val instanceof cEmpty ) {
            var d = new Date( arg0.getValue() );
            if ( isNaN( d ) ) {
                d = g_oFormatParser.parseDate( arg0.getValue() );
                if ( d == null ) {
                    return this.setCA( new cError( cErrorType.wrong_value_type ), true );
                }
                val = d.value;
            }
            else
                val = ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay + ( c_DateCorrectConst + (g_bDate1904 ? 0 : 1) );
        }
        else {
            val = arg0.tocNumber().getValue();
        }
    }
    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else {
        val = parseInt( ( ( val * 24 - Math.floor( val * 24 ) ) * 60 ).toFixed( cExcelDateTimeDigits ) ) % 60;
        return this.setCA( new cNumber( val ), true, 0 );
    }
}
cMINUTE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( time-value )"
    };
}

function cMONTH() {
//    cBaseFunction.call( this, "MONTH" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "MONTH";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cMONTH.prototype = Object.create( cBaseFunction.prototype )
cMONTH.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], val;
    if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocNumber();
    }

    if ( arg0 instanceof cError ) return this.setCA( arg0, true );
    else if ( arg0 instanceof cNumber || arg0 instanceof cBool ) {
        val = arg0.tocNumber().getValue();
    }
    else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ) {
        val = arg0.getValue();
        if ( val instanceof cError ) return this.setCA( val, true );
        else if ( val instanceof cNumber || val instanceof cBool ) {
            val = arg0.tocNumber().getValue();
        }
        else {
            return this.setCA( new cError( cErrorType.wrong_value_type ), true );
        }
    }
    else if ( arg0 instanceof cString ) {
        val = arg0.tocNumber();
        if ( val instanceof cError || val instanceof cEmpty ) {
            var d = new Date( arg0.getValue() );
            if ( isNaN( d ) ) {
                return this.setCA( new cError( cErrorType.wrong_value_type ), true );
            }
            else
                val = Math.floor( ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay + ( c_DateCorrectConst + (g_bDate1904 ? 0 : 1) ) );
        }
        else {
            val = arg0.tocNumber().getValue();
        }
    }
    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    if ( !g_bDate1904 ) {
        if ( val == 60 )
            return this.setCA( new cNumber( 2 ), true, 0 );
        else
            return this.setCA( new cNumber( ( new Date( ( (val == 0 ? 1 : val) - c_DateCorrectConst - 1 ) * c_msPerDay ) ).getUTCMonth() + 1 ), true, 0 );
    }
    else
        return this.setCA( new cNumber( ( new Date( ( (val == 0 ? 1 : val) - c_DateCorrectConst ) * c_msPerDay ) ).getUTCMonth() + 1 ), true, 0 );
}
cMONTH.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( date-value )"
    };
}

function cNETWORKDAYS() {
//    cBaseFunction.call( this, "NETWORKDAYS" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "NETWORKDAYS";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cNETWORKDAYS.prototype = Object.create( cBaseFunction.prototype )
cNETWORKDAYS.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arrDateIncl = [];

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof cError ) return this.value = arg0;
    if ( arg1 instanceof cError ) return this.value = arg1;

    var val0 = arg0.getValue(), val1 = arg1.getValue(), dif, count = 0;

    if ( val0 < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else if ( !g_bDate1904 ) {
        if ( val0 < 60 )
            val0 = new Date( (val0 - c_DateCorrectConst) * c_msPerDay );
        else if ( val0 == 60 )
            val0 = new Date( (val0 - c_DateCorrectConst - 1) * c_msPerDay );
        else
            val0 = new Date( (val0 - c_DateCorrectConst - 1) * c_msPerDay );
    }
    else
        val0 = new Date( (val0 - c_DateCorrectConst) * c_msPerDay );

    if ( val1 < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else if ( !g_bDate1904 ) {
        if ( val1 < 60 )
            val1 = new Date( (val1 - c_DateCorrectConst) * c_msPerDay );
        else if ( val1 == 60 )
            val1 = new Date( (val1 - c_DateCorrectConst - 1) * c_msPerDay );
        else
            val1 = new Date( (val1 - c_DateCorrectConst - 1) * c_msPerDay );
    }
    else
        val1 = new Date( (val1 - c_DateCorrectConst) * c_msPerDay );

    var holidays = [];

    if ( arg2 ) {
        if ( arg2 instanceof cRef ) {
            var a = arg2.getValue();
            if ( a instanceof cNumber && a.getValue() >= 0 ) {
                holidays.push( a );
            }
        }
        else if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
            var arr = arg2.getValue();
            for ( var i = 0; i < arr.length; i++ ) {
                if ( arr[i] instanceof cNumber && arr[i].getValue() >= 0 ) {
                    holidays.push( arr[i] );
                }
            }
        }
        else if ( arg2 instanceof cArray ) {
            arg2.foreach( function ( elem, r, c ) {
                if ( elem instanceof cNumber ) {
                    holidays.push( elem );
                }
                else if ( elem instanceof cString ) {
                    var res = g_oFormatParser.parse( elem.getValue() );
                    if ( res && res.bDateTime && res.value >= 0 )
                        holidays.push( new cNumber( parseInt( res.value ) ) );
                }
            } )
        }
    }

    for ( var i = 0; i < holidays.length; i++ ) {
        holidays[i] = Date.prototype.getDateFromExcel( holidays[i].getValue() );
    }

    function includeInHolidays( date ) {
        for ( var i = 0; i < holidays.length; i++ ) {
            if ( date.getTime() == holidays[i].getTime() )
                return false;
        }
        return true;
    }

    dif = ( val1 - val0 )
    dif = ( dif + (dif >= 0 ? c_msPerDay : 0 ) ) / c_msPerDay;
    for ( var i = 0; i < Math.abs( dif ); i++ ) {
        var date = new Date( val0 );
        date.setDate( val0.getDate() + i );
        if ( date.getDay() != 6 && date.getDay() != 0 && includeInHolidays( date ) )
            count++;
    }
    return this.value = new cNumber( (dif < 0 ? -1 : 1) * count );
}
cNETWORKDAYS.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( start-date , end-date [ , holidays ] )"
    };
}

function cNETWORKDAYS_INTL() {
    cBaseFunction.call( this, "NETWORKDAYS.INTL" );
}
cNETWORKDAYS_INTL.prototype = Object.create( cBaseFunction.prototype )

function cNOW() {
//    cBaseFunction.call( this, "NOW" );
//    this.setArgumentsMin( 0 );
//    this.setArgumentsMax( 0 );

    this.name = "NOW";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 0;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cNOW.prototype = Object.create( cBaseFunction.prototype )
cNOW.prototype.Calculate = function () {
    var d = new Date();
    this.value = new cNumber( Math.floor( ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay + (c_DateCorrectConst + 1) ) + ( (d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds()) / c_sPerDay ) );
    this.value.numFormat = 22;
    return this.setCA( this.value, true );
}
cNOW.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"()"
    };
}

function cSECOND() {
//    cBaseFunction.call( this, "SECOND" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "SECOND";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cSECOND.prototype = Object.create( cBaseFunction.prototype )
cSECOND.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], val;
    if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocNumber();
    }

    if ( arg0 instanceof cError ) return this.setCA( arg0, true );
    else if ( arg0 instanceof cNumber || arg0 instanceof cBool ) {
        val = arg0.tocNumber().getValue();
    }
    else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ) {
        val = arg0.getValue();
        if ( val instanceof cError ) return this.setCA( val, true );
        else if ( val instanceof cNumber || val instanceof cBool ) {
            val = arg0.tocNumber().getValue();
        }
        else {
            return this.setCA( new cError( cErrorType.wrong_value_type ), true );
        }
    }
    else if ( arg0 instanceof cString ) {
        val = arg0.tocNumber();
        if ( val instanceof cError || val instanceof cEmpty ) {
            var d = new Date( arg0.getValue() );
            if ( isNaN( d ) ) {
                d = g_oFormatParser.parseDate( arg0.getValue() );
                if ( d == null ) {
                    return this.setCA( new cError( cErrorType.wrong_value_type ), true );
                }
                val = d.value;
            }
            else
                val = ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay + ( c_DateCorrectConst + (g_bDate1904 ? 0 : 1) );
        }
        else {
            val = arg0.tocNumber().getValue();
        }
    }
    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else {
        val = parseInt( (( val * 24 * 60 - Math.floor( val * 24 * 60 ) ) * 60).toFixed( cExcelDateTimeDigits ) ) % 60;
        return this.setCA( new cNumber( val ), true, 0 );
    }
}
cSECOND.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( time-value )"
    };
}

function cTIME() {
//    cBaseFunction.call( this, "TIME" );
//    this.setArgumentsMin( 3 );
//    this.setArgumentsMax( 3 );

    this.name = "TIME";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 3;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cTIME.prototype = Object.create( cBaseFunction.prototype )
cTIME.prototype.Calculate = function ( arg ) {
    var hour = arg[0], minute = arg[1], second = arg[2];

    if ( hour instanceof cArea || hour instanceof cArea3D ) {
        hour = hour.cross( arguments[1].first );
    }
    else if ( hour instanceof cArray ) {
        hour = hour.getElement( 0 );
    }
    if ( minute instanceof cArea || minute instanceof cArea3D ) {
        minute = minute.cross( arguments[1].first );
    }
    else if ( minute instanceof cArray ) {
        minute = minute.getElement( 0 );
    }
    if ( second instanceof cArea || second instanceof cArea3D ) {
        second = second.cross( arguments[1].first );
    }
    else if ( second instanceof cArray ) {
        second = second.getElement( 0 );
    }

    hour = hour.tocNumber();
    minute = minute.tocNumber();
    second = second.tocNumber();

    if ( hour instanceof cError )    return this.setCA( hour, true );
    if ( minute instanceof cError )    return this.setCA( minute, true );
    if ( second instanceof cError )    return this.setCA( second, true );

    hour = hour.getValue();
    minute = minute.getValue();
    second = second.getValue();

    var v = (hour * 60 * 60 + minute * 60 + second) / c_sPerDay;
    this.setCA( new cNumber( v - Math.floor( v ) ), true );
    if ( arguments[1].getNumFormatStr().toLowerCase() === "general" )
        this.value.numFormat = 18;
    return this.value;
}
cTIME.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( hour, minute, second )"
    };
}

function cTIMEVALUE() {
//    cBaseFunction.call( this, "TIMEVALUE" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "TIMEVALUE";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cTIMEVALUE.prototype = Object.create( cBaseFunction.prototype )
cTIMEVALUE.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0];

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocString();

    if ( arg0 instanceof cError )
        return this.value = arg0;

    if ( arg0.tocNumber() instanceof cNumber && arg0.tocNumber().getValue() > 0 )
        return this.value = new cNumber( parseInt( arg0.tocNumber().getValue() ) );

    var res = g_oFormatParser.parse( arg0.getValue() );

    if ( res && res.bDateTime )
        return this.value = new cNumber( res.value - parseInt( res.value ) );
    else
        return this.value = new cError( cErrorType.wrong_value_type );
}
cTIMEVALUE.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( date-time-string )"
    };
}

function cTODAY() {
//    cBaseFunction.call( this, "TODAY" );
//    this.setArgumentsMin( 0 );
//    this.setArgumentsMax( 0 );

    this.name = "TODAY";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 0;
    this.argumentsCurrent = 0;
    this.argumentsMax = 0;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.def;

}
cTODAY.prototype = Object.create( cBaseFunction.prototype )
cTODAY.prototype.Calculate = function () {
    this.setCA( new cNumber( new Date().getExcelDate() ), true );
    if ( arguments[1].getNumFormatStr().toLowerCase() === "general" )
        this.value.numFormat = 14;
    return this.value;
}
cTODAY.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"()"
    };
}

function cWEEKDAY() {
//    cBaseFunction.call( this, "WEEKDAY" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "WEEKDAY";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cWEEKDAY.prototype = Object.create( cBaseFunction.prototype )
cWEEKDAY.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber( 1 );

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof cError )
        return this.value = arg0;

    if ( arg1 instanceof cError )
        return this.value = arg1;

    var weekday;

    switch ( arg1.getValue() ) {
        case 1: /* 1 (Sunday) through 7 (Saturday)  */
        case 17:/* 1 (Sunday) through 7 (Saturday) */
            weekday = [1, 2, 3, 4, 5, 6, 7];
            break;
        case 2: /* 1 (Monday) through 7 (Sunday)    */
        case 11:/* 1 (Monday) through 7 (Sunday)    */
            weekday = [7, 1, 2, 3, 4, 5, 6];
            break;
        case 3: /* 0 (Monday) through 6 (Sunday)    */
            weekday = [ 6, 0, 1, 2, 3, 4, 5];
            break;
        case 12:/* 1 (Tuesday) through 7 (Monday)   */
            weekday = [6, 7, 1, 2, 3, 4, 5];
            break;
        case 13:/* 1 (Wednesday) through 7 (Tuesday) */
            weekday = [5, 6, 7, 1, 2, 3, 4];
            break;
        case 14:/* 1 (Thursday) through 7 (Wednesday) */
            weekday = [ 4, 5, 6, 7, 1, 2, 3];
            break;
        case 15:/* 1 (Friday) through 7 (Thursday) */
            weekday = [3, 4, 5, 6, 7, 1, 2];
            break;
        case 16:/* 1 (Saturday) through 7 (Friday) */
            weekday = [2, 3, 4, 5, 6, 7, 1];
            break;
        default:
            return this.value = new cError( cErrorType.not_numeric );
    }
    if ( arg0.getValue() < 0 )
        return this.value = new cError( cErrorType.wrong_value_type );

    return this.value = new cNumber( weekday[new Date( (arg0.getValue() - (c_DateCorrectConst + 1)) * c_msPerDay ).getDay()] );
}
cWEEKDAY.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( serial-value [ , weekday-start-flag ] )"
    };
}

function cWEEKNUM() {
//    cBaseFunction.call( this, "WEEKNUM" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 2 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "WEEKNUM";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 2;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cWEEKNUM.prototype = Object.create( cBaseFunction.prototype )
cWEEKNUM.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1] ? arg[1] : new cNumber( 1 ), type = 0;

    function WeekNumber( dt, iso, type ) {
        dt.setHours( 0, 0, 0 );
        var startOfYear = new Date( dt.getFullYear(), 0, 1 );
        var endOfYear = new Date( dt );
        endOfYear.setMonth( 11 );
        endOfYear.setDate( 31 );
        var wk = parseInt( ((dt - startOfYear) / c_msPerDay + iso[startOfYear.getDay()]) / 7 );
        if ( type )
            switch ( wk ) {
                case 0:
                    // Возвращаем номер недели от 31 декабря предыдущего года
                    startOfYear.setDate( 0 );
                    return WeekNumber( startOfYear, iso, type );
                case 53:
                    // Если 31 декабря выпадает до четверга 1 недели следующего года
                    if ( endOfYear.getDay() < 4 )
                        return new cNumber( 1 );
                    else
                        return new cNumber( wk );
                default:
                    return new cNumber( wk );
            }
        else {
            wk = parseInt( ((dt - startOfYear) / c_msPerDay + iso[startOfYear.getDay()] + 7) / 7 );
            return new cNumber( wk );
        }
    }

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof cError )
        return this.value = arg0;

    if ( arg1 instanceof cError )
        return this.value = arg1;

    if ( arg0.getValue() < 0 )
        return this.value = new cError( cErrorType.not_numeric );

    var weekdayStartDay;

    switch ( arg1.getValue() ) {
        case 1: /* 1 (Sunday) through 7 (Saturday)  */
        case 17:/* 1 (Sunday) through 7 (Saturday) */
            weekdayStartDay = [0, 1, 2, 3, 4, 5, 6];
            break;
        case 2: /* 1 (Monday) through 7 (Sunday)    */
        case 11:/* 1 (Monday) through 7 (Sunday)    */
            weekdayStartDay = [6, 0, 1, 2, 3, 4, 5];
            break;
        case 12:/* 1 (Tuesday) through 7 (Monday)   */
            weekdayStartDay = [5, 6, 0, 1, 2, 3, 4];
            break;
        case 13:/* 1 (Wednesday) through 7 (Tuesday) */
            weekdayStartDay = [4, 5, 6, 0, 1, 2, 3];
            break;
        case 14:/* 1 (Thursday) through 7 (Wednesday) */
            weekdayStartDay = [3, 4, 5, 6, 0, 1, 2];
            break;
        case 15:/* 1 (Friday) through 7 (Thursday) */
            weekdayStartDay = [2, 3, 4, 5, 6, 0, 1];
            break;
        case 16:/* 1 (Saturday) through 7 (Friday) */
            weekdayStartDay = [1, 2, 3, 4, 5, 6, 0];
            break;
        case 21:
            weekdayStartDay = [6, 7, 8, 9, 10, 4, 5];
//                { 6, 7, 8, 9, 10, 4, 5 }
            type = 1;
            break;
        default:
            return this.value = new cError( cErrorType.not_numeric );
    }

    return this.value = new cNumber( WeekNumber( new Date( (arg0.getValue() - (c_DateCorrectConst + 1)) * c_msPerDay ), weekdayStartDay, type ) );

}
cWEEKNUM.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( serial-value [ , weekday-start-flag ] )"
    };
}

function cWORKDAY() {
//    cBaseFunction.call( this, "WORKDAY" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "WORKDAY";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cWORKDAY.prototype = Object.create( cBaseFunction.prototype )
cWORKDAY.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2], arrDateIncl = [];

    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();

    if ( arg0 instanceof cError ) return this.value = arg0;
    if ( arg1 instanceof cError ) return this.value = arg1;

    var val0 = arg0.getValue(), val1 = arg1.getValue(), holidays = []

    if ( val0 < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );
    else if ( !g_bDate1904 ) {
        if ( val0 < 60 )
            val0 = new Date( (val0 - c_DateCorrectConst) * c_msPerDay );
        else if ( val0 == 60 )
            val0 = new Date( (val0 - c_DateCorrectConst - 1) * c_msPerDay );
        else
            val0 = new Date( (val0 - c_DateCorrectConst - 1) * c_msPerDay );
    }
    else
        val0 = new Date( (val0 - c_DateCorrectConst) * c_msPerDay );

    if ( arg2 ) {
        if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
            var arr = arg2.getValue();
            for ( var i = 0; i < arr.length; i++ ) {
                if ( arr[i] instanceof cNumber && arr[i].getValue() >= 0 ) {
                    holidays.push( arr[i] );
                }
            }
        }
        else if ( arg2 instanceof cArray ) {
            arg2.foreach( function ( elem, r, c ) {
                if ( elem instanceof cNumber ) {
                    holidays.push( elem );
                }
                else if ( elem instanceof cString ) {
                    var res = g_oFormatParser.parse( elem.getValue() );
                    if ( res && res.bDateTime && res.value >= 0 )
                        holidays.push( new cNumber( parseInt( res.value ) ) );
                }
            } )
        }
    }

    for ( var i = 0; i < holidays.length; i++ ) {
        if ( !g_bDate1904 ) {
            if ( holidays[i].getValue() < 60 )
                holidays[i] = new Date( (holidays[i].getValue() - c_DateCorrectConst) * c_msPerDay );
            else if ( holidays[i] == 60 )
                holidays[i] = new Date( (holidays[i].getValue() - c_DateCorrectConst - 1) * c_msPerDay );
            else
                holidays[i] = new Date( (holidays[i].getValue() - c_DateCorrectConst - 1) * c_msPerDay );
        }
        else
            holidays[i] = new Date( (holidays[i].getValue() - c_DateCorrectConst) * c_msPerDay );
    }

    function notAHolidays( date ) {
        for ( var i = 0; i < holidays.length; i++ ) {
            if ( date.getTime() == holidays[i].getTime() )
                return false;
        }
        return true;
    }

    var dif = arg1.getValue(), count = 1, dif1 = dif > 0 ? 1 : dif < 0 ? -1 : 0, val, date = val0;
    while ( Math.abs( dif ) > count ) {
        date = new Date( val0.getTime() + dif1 * c_msPerDay );
        if ( date.getDay() != 6 && date.getDay() != 0 && notAHolidays( date ) )
            count++;
        dif >= 0 ? dif1++ : dif1--;
    }
    date = new Date( val0.getTime() + dif1 * c_msPerDay );
    val = parseInt( ( date.getTime() / 1000 - date.getTimezoneOffset() * 60 ) / c_sPerDay + ( c_DateCorrectConst + (g_bDate1904 ? 0 : 1) ) );

    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );

    if ( arguments[1].getNumFormatStr().toLowerCase() === "general" )
        return this.setCA( new cNumber( val ), true, 14 );
    else
        return this.setCA( new cNumber( val ), true );
}
cWORKDAY.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( start-date , day-offset [ , holidays ] )"
    };
}

function cWORKDAY_INTL() {
    cBaseFunction.call( this, "WORKDAY.INTL" );
}
cWORKDAY_INTL.prototype = Object.create( cBaseFunction.prototype )

function cYEAR() {
//    cBaseFunction.call( this, "YEAR" );
//    this.setArgumentsMin( 1 );
//    this.setArgumentsMax( 1 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "YEAR";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 1;
    this.argumentsCurrent = 0;
    this.argumentsMax = 1;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cYEAR.prototype = Object.create( cBaseFunction.prototype )
cYEAR.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], val;
    if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElement( 0 );
    }
    else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first ).tocNumber();
    }

    if ( arg0 instanceof cError ) return this.setCA( arg0, true );
    else if ( arg0 instanceof cNumber || arg0 instanceof cBool ) {
        val = arg0.tocNumber().getValue();
    }
    else if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        return this.setCA( new cError( cErrorType.wrong_value_type ), true );
    }
    else if ( arg0 instanceof cRef || arg0 instanceof cRef3D ) {
        val = arg0.getValue();
        if ( val instanceof cError ) return this.setCA( val, true );
        else if ( val instanceof cNumber || val instanceof cBool ) {
            val = arg0.tocNumber().getValue();
        }
        else {
            return this.setCA( new cError( cErrorType.wrong_value_type ), true );
        }
    }
    else if ( arg0 instanceof cString ) {
        val = arg0.tocNumber();
        if ( val instanceof cError || val instanceof cEmpty ) {
            var d = new Date( arg0.getValue() );
            if ( isNaN( d ) ) {
                return this.setCA( new cError( cErrorType.wrong_value_type ), true );
            }
            else
                val = Math.floor( ( d.getTime() / 1000 - d.getTimezoneOffset() * 60 ) / c_sPerDay + ( c_DateCorrectConst + (g_bDate1904 ? 0 : 1) ) );
        }
        else {
            val = arg0.tocNumber().getValue();
        }
    }
    if ( val < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true, 0 );
    else
        return this.setCA( new cNumber( (new Date( (val - (c_DateCorrectConst + 1)) * c_msPerDay )).getUTCFullYear() ), true, 0 );
}
cYEAR.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"( date-value )"
    };
}

function cYEARFRAC() {
//    cBaseFunction.call( this, "YEARFRAC" );
//    this.setArgumentsMin( 2 );
//    this.setArgumentsMax( 3 );
//    this.setFormat( this.formatType.noneFormat );

    this.name = "YEARFRAC";
    this.type = cElementType.func;
    this.value = null;
    this.argumentsMin = 2;
    this.argumentsCurrent = 0;
    this.argumentsMax = 3;
    this.formatType = {
        def:-1, //подразумевается формат первой ячейки входящей в формулу.
        noneFormat:-2
    };
    this.numFormat = this.formatType.noneFormat;

}
cYEARFRAC.prototype = Object.create( cBaseFunction.prototype )
cYEARFRAC.prototype.Calculate = function ( arg ) {
    var arg0 = arg[0], arg1 = arg[1], arg2 = arg[2] ? arg[2] : new cNumber( 0 );
    if ( arg0 instanceof cArea || arg0 instanceof cArea3D ) {
        arg0 = arg0.cross( arguments[1].first );
    }
    else if ( arg0 instanceof cArray ) {
        arg0 = arg0.getElementRowCol( 0, 0 );
    }

    if ( arg1 instanceof cArea || arg1 instanceof cArea3D ) {
        arg1 = arg1.cross( arguments[1].first );
    }
    else if ( arg1 instanceof cArray ) {
        arg1 = arg1.getElementRowCol( 0, 0 );
    }

    if ( arg2 instanceof cArea || arg2 instanceof cArea3D ) {
        arg2 = arg2.cross( arguments[1].first );
    }
    else if ( arg2 instanceof cArray ) {
        arg2 = arg2.getElementRowCol( 0, 0 );
    }

    arg0 = arg0.tocNumber();
    arg1 = arg1.tocNumber();
    arg2 = arg2.tocNumber();

    if ( arg0 instanceof cError ) return this.value = arg0;
    if ( arg1 instanceof cError ) return this.value = arg1;
    if ( arg2 instanceof cError ) return this.value = arg2;

    var val0 = arg0.getValue(), val1 = arg1.getValue();

    if ( val0 < 0 || val1 < 0 )
        return this.setCA( new cError( cErrorType.not_numeric ), true );

    val0 = Date.prototype.getDateFromExcel( val0 );
    val1 = Date.prototype.getDateFromExcel( val1 );
    var date1 = val0.getDate(), date2 = val1.getDate(), month1 = val0.getMonth(), month2 = val1.getMonth(), year1 = val0.getFullYear(), year2 = val1.getFullYear();
    switch ( arg2.getValue() ) {
        case 0:
            return this.value = new cNumber( Math.abs( GetDiffDate360( date1, month1, year1, val1.isLeapYear(), date2, month2, year2, false ) ) / 360 );
            break;
        case 1:
            var yc = Math.abs( year2 - year1 ),
                sd = year1 > year2 ? val1 : val0,
                yearAverage = sd.isLeapYear() ? 366 : 365, dayDiff = Math.abs( val1 - val0 );
            for ( var i = 0; i < yc; i++ ) {
                sd.addYears( 1 );
                yearAverage += sd.isLeapYear() ? 366 : 365;
            }
            yearAverage /= (yc + 1);
            dayDiff /= (yearAverage * c_msPerDay);
            return this.value = new cNumber( dayDiff );
            break;
        case 2:
            var dayDiff = Math.abs( val1 - val0 );
            dayDiff /= (360 * c_msPerDay);
            return this.value = new cNumber( dayDiff );
            break;
        case 3:
            var dayDiff = Math.abs( val1 - val0 );
            dayDiff /= (365 * c_msPerDay);
            return this.value = new cNumber( dayDiff );
            break;
        case 4:
            return this.value = new cNumber( Math.abs( GetDiffDate360( date1, month1, year1, val1.isLeapYear(), date2, month2, year2, true ) ) / 360 );
            break;
        default:
            return this.value = new cError( cErrorType.not_numeric )
    }

}
cYEARFRAC.prototype.getInfo = function () {
    return {
        name:this.name,
        args:"(  start-date , end-date [ , basis ] )"
    };
}
