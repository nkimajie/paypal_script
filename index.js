<script>
    var shipAmount = 0;
        $('#country').change(function(){
            var countrySelected = $(this).val();
            if(countrySelected == 'United States'){
                shipAmount = 3;
            }
            console.log(countrySelected);
            console.log(shipAmount);

        });
        $('#checkoutButton').click(function(){
        var formValues= $('#checkOutForm').serialize();
        // var token = $("#otp").val();
        // var email = $("#emailAddress").val();
        console.log(formValues);
        $.ajax({
            url: '<?= base_url('payment/checkout'); ?>',
            type: 'post',
            dataType: 'JSON',
            data: formValues,
            beforeSend: function (){
              $("#checkoutButton").text('Loading...');
              $("#checkoutButton").attr('disabled', true);
            },
            success: function(response) {
                console.log(response);
                $("#checkoutButton").text('Continue to checkout');
                $("#checkoutButton").attr('disabled', false);
                if(response.success == true){
                  // swal("Congrats", 'Your Request Was Successful, please click on the paypal to complete your order.', "success");
                  Swal.fire({
                    title: "Congrats",
                    html: '<p>Your Request Was Successful, please click on the paypal to complete your order.</p>',
                    icon: "success",
                  });

                  $('#payPalDiv').show();
                  $('#checkoutButton').hide();
                  $('#checkOutForm').hide();
                }else{
                  // swal("Oops!!!", response.error, "error");
                  Swal.fire({
                    title: "Oops!!!",
                    html: response.error,
                    icon: "error",
                  });
                }
                // setTimeout(function(){ location.reload(); }, 500);
            },
            error: function(response){
                console.log(response);
                // swal("Oops!!!", 'An error occurred at our end, please try again', "error");
                 Swal.fire({
                    title: "Oops!!!",
                    html: '<p>An error occurred at our end, please try again</p>',
                    icon: "error",
                  });
                $("#checkoutButton").text('Continue to Checkout');
                $("#checkoutButton").attr('disabled', false);
            }
        });
    });

    $.ajax({
            url: '<?= base_url('payment/amount'); ?>',
            type: 'get',
            dataType: 'JSON',
            success: function(response) {
                paypal.Buttons({
                  createOrder: function(data, actions) {
                    //console.log(response);
                    var amount = response.amount + shipAmount;
                    amount = parseFloat(amount).toFixed(2);
                    //console.log(amount);
                    // This function sets up the details of the transaction, including the amount and line item details.
                    return actions.order.create({
                      purchase_units: [{
                        amount: {
                          value: amount
                        }
                      }]
                    });
                  },
                  onApprove: function(data, actions) {
                    // This function captures the funds from the transaction.
                    return actions.order.capture().then(function(details) {
                      // This function shows a transaction success message to your buyer.
                      // alert('Transaction completed by ' + details.payer.name.given_name);
                      if(details.status == "COMPLETED"){
                        console.log(details);
                        // swal("Congrats", 'Your Purchase Was Successful', "success");
                        Swal.fire({
                          title: "Congrats",
                          html: '<p>Your Purchase Was Successful.</p>',
                          icon: "success",
                        });

                        window.location.href = '<?= base_url("payment/Purchase_Successful"); ?>';
                      }
                    });
                  }
                }).render('#paypal-button-container');
            }
        });

</script>
