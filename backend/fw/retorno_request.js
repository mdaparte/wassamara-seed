var ring = require('ring'); 
var display_consulta_ok = false;

var RetornoRequest = ring.create({

    retorno : function(ok, kind, description, notify, notifyKind, req, data){
        var r = { message:{ } };
        r.message.ok = ok;
        r.message.kind = kind;
        r.message.notify = notify;
        r.message.notifyKind = notifyKind;
        r.message.description = description;

        if(req.token){
            r.token = req.token;
        }

        if(display_consulta_ok){
            r.message.debug_info = req.route.path;
        }

        r.data = data;
        return r;
    },

    retornoSucesso : function(description, notify, notifyKind, req, data){
        return this.retorno(true, 'success', description, notify, notifyKind, req, data);
    },

    retornoErro : function(description, notify, notifyKind, req, data){
        if(description.name && description.length && description.severity){
            description = description.toString();
        }

        if(description.toString().indexOf('Error:') === 0){
            description = description.toString();
        }

        return this.retorno(false, 'error', description, notify, notifyKind, req, data || {});
    },

    retornoInfo : function(description, notify, notifyKind, req, data){
        return this.retorno(true, 'info', description, notify, notifyKind, req, data);
    },

    retornoWarning : function(description, notify, notifyKind, req, data){
        return this.retorno(true, 'warning', description, notify, notifyKind, req, data);
    }
});    


exports.RetornoRequest = RetornoRequest;
