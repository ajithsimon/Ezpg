/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$.ajax({url: "\topics.json", success: function (data) {
        var obj = JSON.parse(data);
    }});

$(document).ready(function(){
    
});