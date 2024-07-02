<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\CustomerAddress;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /*====================================get all customers========================================*/
    public function index(Request $request)
    {
        return Customer::paginate($request->input('limitDataShow', 10));
    }

    /*=============================get customer by id========================================*/
    public function showCustomerById($id)
    {
      $customer= Customer::findOrFail($id);
      $customerAddress= CustomerAddress::where('customer_id',$id)->get();
      return response()->json(['customerAddress' => $customerAddress,'customer'=>$customer]);
    }

    /*=============================get customer details ========================================*/
    public function view($id)
  {
      $customer = Customer::find($id);

      if (!$customer) {
          return response()->json(['error' => 'Customer not found'], 404);
      }
      $customerAddress = CustomerAddress::where('customer_id', $id)->get();
      return response()->json(['customerAddress' => $customerAddress]);
  }

    /*=============================get user by searching========================================*/
    public function search(Request $request){
      $query=$request->input('first_name');
      $output=Customer::where('first_name','like',"%$query%")->get();
        return response()->json($output);
    }

    /*=============================edit user========================================*/
    public function editUser(Request $request, $id)
  {
      return DB::transaction(function () use ($request, $id) {
          try {
              // Validate the request data
              $request->validate([
                  'firstName' => 'required|string',
                  'lastName' => 'required|string',
                  'phoneNumber' => 'required|string',
                  'birthdate' => 'required|date',
                  'addressLine1' => 'required|string',
                  'addressLine2' => 'nullable|string',
                  'postalCode' => 'required|string',
                  'country' => 'required|exists:countries,id',
                  'state' => 'required|string',
                  'city' => 'nullable|string',
                  'user' => 'required|exists:users,id',
                  'ActivedOrDeactivated' => 'required|string',
                  'addressType' => 'required|string',
              ]);

              // Retrieve the existing customer record
              $customer = Customer::findOrFail($id);

              // Update the customer record
              $customer->update([
                  'first_name' => $request->firstName,
                  'last_name' => $request->lastName,
                  'phone' => $request->phoneNumber,
                  'created_at' => $request->birthdate,
                  'status'=>  $request->ActivedOrDeactivated,
                  'updated_by' =>  $request->user,
              ]);

              // Retrieve or create customer address record
              $customerAddress = CustomerAddress::firstOrNew(['customer_id' => $customer->id, 'type' => $request->addressType]);

              // Update the customer address record
              $customerAddress->fill([
                  'address1' => $request->addressLine1,
                  'address2' => $request->addressLine2,
                  'city' => $request->city,
                  'state' => $request->state,
                  'zipcode' => $request->postalCode,
                  'country_id' => $request->country,
              ])->save();

              // Commit the transaction
              DB::commit();

              // Return success response
              return response()->json(['message' => 'Customer updated successfully'], 200);
          } catch (ValidationException $e) {
              DB::rollBack();
              return response()->json(['errors' => $e->validator->errors()], 422);
          } catch (\Exception $e) {
              DB::rollBack();
              return response()->json(['message' => 'Failed to update customer', 'error' => $e->getMessage()], 500);
          }
      });
  }


  /*=============================fetch required info for customer========================================*/
  public function getCountries(Request $request) {
    // Retrieve all countries
    $countries = Country::all();

        $users = User::doesntHave('customer')->get();

    \Log::info('Formatted countries Items: ', $countries->toArray());
    return response()->json(['countries' => $countries, 'users' => $users]);
}
  /*=============================fetch states based on the country selected========================================*/
  public function getStates($id)
    {
        $states = State::where('country_id', $id)->get();
        return response()->json(['states' => $states]);
    }
    /*=============================fetch cities based on the state selected========================================*/
    public function getCities($id)
      {
          $cities = City::where('state_id', $id)->get();
          return response()->json(['cities' => $cities]);
      }

  /*=============================add customer========================================*/

  public function addCustomer(Request $request)
  {
      // Wrap the logic in a database transaction
      return DB::transaction(function () use ($request) {
          try {
              // Validate the request data
              $request->validate([
                  'firstName' => 'required|string',
                  'lastName' => 'required|string',
                  'phoneNumber' => 'required|string',
                  'birthdate' => 'required|date',
                  'addressLine1' => 'required|string',
                  'addressLine2' => 'nullable|string',
                  'postalCode' => 'required|string',
                  'country' => 'required|exists:countries,id',
                  'state' => 'required|string',
                  'city' => 'nullable|string',
                  'user' => 'required|exists:users,id',
                  'ActivedOrDeactivated' => 'required|string',
                  'addressType' => 'required|string',
              ]);

              // Begin creating customer record
              $customer = Customer::create([
                  'first_name' => $request->firstName,
                  'last_name' => $request->lastName,
                  'phone' => $request->phoneNumber,
                  'created_at' => $request->birthdate,
                  'status'=>  $request->ActivedOrDeactivated,
                  'created_by' =>  $request->user,
                  'updated_by' =>  $request->user,
              ]);
                $customerId = $customer->id;
              // Create customer address record
              $customerAddress = CustomerAddress::create([
                  'customer_id' => $customerId,
                  'type' => $request->addressType,
                  'address1' => $request->addressLine1,
                  'address2' => $request->addressLine2,
                  'city' => $request->city,
                  'state' => $request->state,
                  'zipcode' => $request->postalCode,
                  'country_id' => $request->country,
              ]);
                DB::commit();
              // Return success response
              return response()->json(['message' => 'Customer created successfully'], 200);
          } catch (ValidationException $e) {
              DB::rollBack();
              return response()->json(['errors' => $e->validator->errors()], 422);
          } catch (\Exception $e) {
              DB::rollBack();
              return response()->json(['message' => 'Failed to create customer', 'error' => $e->getMessage()], 500);
          }
      });
  }

  public function getCustomersDetails(Request $request) {
      // Using a join to fetch customers with their respective order counts
      $customers = DB::table('customers')
          ->leftJoin('users', 'customers.created_by', '=', 'users.id')
          ->leftJoin('orders', 'users.id', '=', 'orders.created_by')
          ->select(
              'customers.id',
              'customers.first_name',
              'customers.last_name',
              'customers.created_by',
              DB::raw('COUNT(orders.id) as order_count')
          )
          ->groupBy(
              'customers.id',
              'customers.first_name',
              'customers.last_name',
              'customers.created_by'
          )
          ->get();

      return response()->json(['customers' => $customers]);
  }



    public function destroy($id)
    {
        return Customer::findOrFail($id)->delete();
    }
}
