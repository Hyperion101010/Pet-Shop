App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if(window.ethereum){
      App.web3Provider = window.ethereum;
      try{
        await window.ethereum.enable();
      } catch(error){
        console.error("denied access");
      }
    }
    else if(window.web3){
        App.web3Provider = window.web3.currentProvider;
    }
    else{
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    
    $.getJSON('adoption.json', function(data){
    var adoptionartifact = data;

    App.contracts.Aadoption = TruffleContract(adoptionartifact);

    App.contracts.Aadoption.setProvider(App.web3Provider);

    return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptioninstance;

    App.contracts.Aadoption.deployed().then(function(instance){
      adoptioninstance = instance;
      return adoptioninstance.getadoptee.call();
    }).then(function(adoptee) {
      for(i=0; i< adoptee.length; i++ ) {
        if (adoptee[i] == '0x00000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptioninstance;

    web3.eth.getAccounts(function(error, accounts) {
      if(error){
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Aadoption.deployed().then(function(instance){
        adoptioninstance = instance;

        return adoptioninstance.adopt(petId, {from: account});
      }).then(function(result){
        return App.markAdopted();
      }).catch(function(err){
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
