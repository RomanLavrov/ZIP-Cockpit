<div style="height:80px;"></div>
<div class="d-flex justify-content-start">
   <div class="p-2 card-wrap">
      <div class="card-header">Header</div>
      <div class="card-content">Content</div>
   </div>

   <div class="p-2 card-wrap">
      <div class="card-header">Header</div>
      <div class="card-content">Content</div>
   </div>

   <div class="p-2 card-wrap">
      <div class="card-header">Header</div>
      <div class="card-content">Content</div>
   </div>
</div>

<div class="d-flex justify-content-start">
   <div class="card-wrap">
      <div class="d-flex  justify-content-start card-header">
         <div class="p-2 card-icon" id="warning-icon"></div>
         <div class="p-2 w-100">
            <div>Warnung</div>
            <hr class="line-thin" style="">
            <div>Total: 2</div>
         </div>
         <div class="p-2" id="warning-collapse"></div>
      </div>

      <div class="card-content">
         <div class="d-flex card-warning">
            <div class="p-2">Room</div>
            <div class="p-2 line-separator">Time</div>
            <div class="p-2 line-separator">Parameter:</div>
            <div class="p-2">Value</div>
            <div class="p-2 line-separator"><a class="btn btn-primary">link</a></div>
         </div>

         <div class="d-flex card-warning">
            <div class="p-2">Room</div>
            <div class="p-2 line-separator">Time</div>
            <div class="p-2 line-separator">Parameter:</div>
            <div class="p-2">Value</div>
            <div class="p-2 line-separator"><a class="btn btn-primary">link</a></div>
         </div>
      </div>
   </div>
</div>

<div class="d-flex justify-content-start">
   <div class="card-wrap">
      <div class="d-flex  justify-content-start card-header">
         <div class="p-2 card-icon" id="presence-icon"></div>
         <div class="p-2 w-100">
            <div>Raumbelegung</div>
            <hr class="line-thin">
            <div>Total: 2</div>
         </div>
         <div class="p-2" id="presence-collapse"></div>
      </div>
      <div class="card-content">
         <div class="table-responsive-md">
            <table class="table table-hover">
               <thead class="thead-dark">
                  <tr>
                     <th scope="col">#</th>
                     <th scope="col">Space</th>
                     <th scope="col">Utilisation</th>
                     <th scope="col"></th>
                  </tr>
               </thead>
               <tbody>
                  <!--
                  <?php $counter=1; foreach ($rooms as $room): ?>
                     <tr>
                     <th scope="row"><?php echo($counter++)?></th>
                     <td><?php echo($room->Name ." ". ($room->Number == "0" ? "" : "$room->Number")) ?></td>
                     <td><?php /*echo $room['utilization']*/ ?></td>
                     <td></td>
                  </tr>
                  <?php endforeach?>
                  -->

                  <?php $counter= ?>
                 
               </tbody>
            </table>
         </div>
      </div>
   </div>
</div>

<div class="d-flex justify-content-start">
   <div class="card-wrap">
      <div class="d-flex  justify-content-start card-header">
         <div class="p-2 card-icon" id="climat-icon"></div>
         <div class="p-2 w-100">
            <div>Innenklima</div>
            <hr class="line-thin">
            <div>Total: 2</div>
         </div>
         <div class="p-2" id="climat-collapse"></div>
      </div>
      <div class="card-content">
         Content
      </div>
   </div>
</div>