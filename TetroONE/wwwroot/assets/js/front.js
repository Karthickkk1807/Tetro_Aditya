$(function () {


    // ------------------------------------------------------- //
    // Sidebar
    // ------------------------------------------------------ //
    $('.sidebar-toggler').on('click', function () {
        $('.sidebar').toggleClass('shrink show');
        $('.dynamin-page-box').toggleClass('shrink1 show');
        
        
    });


    
  //== Sweetalert Demo 1
		$('.alert_demo_1').click(function(e) {
			swal('Good job!', {
				buttons: {        			
					confirm: {
						className : 'btn btn-success'
					}
				},
			});
		});

		//== Sweetalert Demo 2
		$('.alert_demo_2').click(function(e) {
			swal("Here's the title!", "...and here's the text!", {
				buttons: {        			
					confirm: {
						className : 'btn btn-success'
					}
				},
			});
		});

		//== Sweetalert Demo 3
		$('.alert_demo_3_1').click(function(e) {
			swal("Good job!", "You clicked the button!", {
				icon : "warning",
				buttons: {        			
					confirm: {
						className : 'btn btn-warning'
					}
				},
			});
		});

		$('.alert_demo_3_2').click(function(e) {
			swal("Good job!", "You clicked the button!", {
				icon : "error",
				buttons: {        			
					confirm: {
						className : 'btn btn-danger'
					}
				},
			});
		});

		$('.alert_demo_3_3').click(function(e) {
			swal("Good job!", "You clicked the button!", {
				icon : "success",
				buttons: {        			
					confirm: {
						className : 'btn btn-success'
					}
				},
			});
		});

		$('.alert_demo_3_4').click(function(e) {
			swal("Good job!", "You clicked the button!", {
				icon : "info",
				buttons: {        			
					confirm: {
						className : 'btn btn-info'
					}
				},
			});
		});

		//== Sweetalert Demo 4
		$('.alert_demo_4').click(function(e) {
			swal({
				title: "Good job!",
				text: "You clicked the button!",
				icon: "success",
				buttons: {
					confirm: {
						text: "Confirm Me",
						value: true,
						visible: true,
						className: "btn btn-success",
						closeModal: true
					}
				}
			});
		});

		$('.alert_demo_5').click(function(e){
			swal({
				title: 'Input Something',
				html: '<br><input class="form-control" placeholder="Input Something" id="input-field">',
				content: {
					element: "input",
					attributes: {
						placeholder: "Input Something",
						type: "text",
						id: "input-field",
						className: "form-control"
					},
				},
				buttons: {
					cancel: {
						visible: true,
						className: 'btn btn-danger'
					},        			
					confirm: {
						className : 'btn btn-success'
					}
				},
			}).then(
			function() {
				swal("", "You entered : " + $('#input-field').val(), "success");
			}
			);
		});

		$('.alert_demo_6').click(function(e) {
			swal("This modal will disappear soon!", {
				buttons: false,
				timer: 3000,
			});
		});

		$('.alert_demo_7').click(function(e) {
			swal({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				type: 'warning',
				buttons:{
					confirm: {
						text : 'Yes, delete it!',
						className : 'btn btn-success'
					},
					cancel: {
						visible: true,
						className: 'btn btn-danger'
					}
				}
			}).then((Delete) => {
				if (Delete) {
					swal({
						title: 'Deleted!',
						text: 'Your file has been deleted.',
						type: 'success',
						buttons : {
							confirm: {
								className : 'btn btn-success'
							}
						}
					});
				} else {
					swal.close();
				}
			});
		});

		$('.alert_delete').click(function(e) {
			swal({
				title: 'Are you sure?',
				text: "You won't be able to revert this!",
				type: 'warning',
				buttons:{
					confirm: {
						text : 'Yes, delete it!',
						className : 'btn btn-success'
					},
					cancel: {
						visible: true,
						text : 'No, cancel!',
						className: 'btn btn-danger'
					}
				}
			}).then((willDelete) => {
				if (willDelete) {
					swal("Successfully deleted!", "", {
						icon: "success",
						timer: 1000,
						buttons : {
							confirm : {
								visible:false,
								//className: 'btn btn-success'
							}
						}
					});
				} 
				
				/*else {
					swal("Not Successfully deleted!", {
						buttons : {
							confirm : {
								className: 'btn btn-success'
							}
						}
					});
				}*/

			});
		})

		$('.alert_save').click(function(e) {
			swal("Successfully Saved!", " ", {
				icon : "success",
				timer: 1000,

				 buttons: {  
					 
				 	confirm: {
						visible:false,
				 	},
				},
			});
		});

		$('.alert_update').click(function(e) {
			swal("Successfully Updated!", "", {
				icon : "success",
				timer: 1000,
				buttons: {        			
					confirm: {
						visible:false,
						//className : 'btn btn-success'
					}
				},
			});
        });
        

 });


