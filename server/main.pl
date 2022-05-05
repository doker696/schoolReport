# Automatically enables "strict", "warnings", "utf8" and Perl 5.16 features
use Mojolicious::Lite -signatures;
use lib "./modules";
use Auth;
use DB;
use Scalar::MoreUtils qw(empty);
use Mojolicious::Static;
use Mojo::Log;
use Data::Dumper;
use Mojo::JSON qw(decode_json encode_json);
plugin 'RenderFile';
my $app = app;
my $db  = db_connect();
my $log = Mojo::Log->new;

$app->hook(
    after_dispatch => sub {
        my $c = shift;
        $c->res->headers->header( 'Access-Control-Allow-Origin' => '*' );
        $c->res->headers->access_control_allow_origin('*');
        $c->res->headers->header( 'Access-Control-Allow-Methods' =>
              'GET, OPTIONS, POST, DELETE, PUT' );
        $c->res->headers->header( 'Access-Control-Allow-Headers' =>
'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
        );

    }
);
get '/' => sub ($c) {
    $c->render( text => "hello" );
};
####
get '/groups' => sub ($c) {
    my $sql = $db->prepare("SELECT * from groups")
      or die "prepare statement failed: $db->errstr()";

    my @results = $db->selectall_arrayref( $sql, { Slice => {} } );

    $c->render( json => @results );
};
post '/groups' => sub ($c) {
    my $name = $c->param('name');
    my $sql  = $db->prepare("insert into groups values(default, \'$name\')")
      or die "prepare statement failed: $db->errstr()";

    my @results = $sql->execute();

    $c->render( json => @results );
};

####
get '/subject' => sub ($c) {
    my $sql = $db->prepare("SELECT * from subject")
      or die "prepare statement failed: $db->errstr()";

    my @results = $db->selectall_arrayref( $sql, { Slice => {} } );

    $c->render( json => @results );
};
####
get '/schedule' => sub ($c) {
    my $sql = $db->prepare("SELECT * from schedule order by start_time")
      or die "prepare statement failed: $db->errstr()";

    my @results = $db->selectall_arrayref( $sql, { Slice => {} } );

    $c->render( json => @results );
};
####
get '/schedule_assignations' => sub ($c) {
    my $sql = $db->prepare("SELECT * from schedule_assignation")
      or die "prepare statement failed: $db->errstr()";

    my @results = $db->selectall_arrayref( $sql, { Slice => {} } );

    $c->render( json => @results );
};

####
get '/classroom' => sub ($c) {
    my $sql = $db->prepare("SELECT * from classroom")
      or die "prepare statement failed: $db->errstr()";

    my @results = $db->selectall_arrayref( $sql, { Slice => {} } );

    $c->render( json => @results );
};
####
post '/schedule' => sub ($c) {
    my $json = $c->req->json;

    my $group_id     = $json->{'group_id'};
    my $classroom_id = $json->{'classroom_id'};
    my $subject_id   = $json->{'subject_id'};
    my $date         = $json->{'date'};
    my $start_time   = $json->{'start_time'};
    my $end_time     = $json->{'end_time'};

    my $sql =
      $db->prepare( "insert into schedule values(default,"
          . $subject_id . ","
          . $classroom_id . ",\'"
          . $date . "\',\'"
          . $start_time . "\',\'"
          . $end_time
          . "\') returning id" )
      or die "prepare statement failed: $db->errstr()";

    $sql->execute();
    my $result    = $sql->fetchrow_hashref();
    my $id        = $result->{'id'};
    my $sqlString = "insert into schedule_assignation values ";

    foreach my $group ( split /\s+/, $group_id ) {
        say "$group\n";
        $sqlString = $sqlString . "(default, $group, $id),";
    }
    chop($sqlString);
    my $sql2 = $db->prepare($sqlString)
      or die "prepare statement failed: $db->errstr()";
    $sql2->execute();

    $c->render( json => $id, status => "201" );
};

put '/schedule/:id' => sub ($c) {
    my $json    = $c->req->json;
    my $idparam = $c->param('id');

    my $group_id     = $json->{'group_id'};
    my $classroom_id = $json->{'classroom_id'};
    my $subject_id   = $json->{'subject_id'};
    my $date         = $json->{'date'};
    my $start_time   = $json->{'start_time'};
    my $end_time     = $json->{'end_time'};

    my $sql = $db->prepare(
        "update schedule set 
       subject_id = " . $subject_id . ",
       classroom_id = " . $classroom_id . ",
       date = \'" . $date . "\',
       start_time = \'" . $start_time . "\',
       end_time = \'" . $end_time . "\' where id = " . $idparam
    ) or die "prepare statement failed: $db->errstr()";

    $sql->execute();
    my $sqlString = "delete from schedule_assignation where schedule_id = " . $idparam. "; insert into schedule_assignation values";

    foreach my $group ( split /\s+/, $group_id ) {
        say "$group\n";
        $sqlString = $sqlString . " (default, $group, $idparam),";
    }
    chop($sqlString);
    my $sql2 = $db->prepare( $sqlString )
      or die "prepare statement failed: $db->errstr()";
    $sql2->execute();

    $c->render( json => $idparam, status => "200" );
};

del '/schedule/:id' => sub ($c) {
    my $idparam = $c->param('id');
    my $sql1 =
      $db->prepare(
        "delete from schedule_assignation where schedule_id = " . $idparam )
      or die "prepare statement failed: $db->errstr()";

    $sql1->execute();
    my $sql = $db->prepare( "delete from schedule where id = " . $idparam )
      or die "prepare statement failed: $db->errstr()";

    $sql->execute();
    $c->render( text => 'success', status => "204" );

};

post 'login' => sub ($c) {
    my $json    = $c->req->json;
    my $login     = $json->{'username'};
    my $pass     = $json->{'password'};
    my $sql       = $db->prepare(
        "select login,is_admin from public.user where login = \'$login\' and password = \'$pass\';"
    ) or die "prepare statement failed: $db->errstr()";
    $sql->execute();
    my $res = $sql->fetchrow_hashref;
    return $c->render(  text => 'bad', status => '400') if empty($res);
    $c->render( json => $res);

};

options 'login' => sub ($c) {
    $c->render( text=> 'good', status => '200');
};

post '/register' => sub ($c) {
    my $json    = $c->req->json;

    my $login     = $json->{'username'};
    my $pass     = $json->{'password'};

    my $sql       = $db->prepare(
        "select count(*) from public.user where login = \'$login\';"
    ) or die "prepare statement failed: $db->errstr()";
    $sql->execute();
    my $res = $sql->fetch()->[0];
    $log->debug($res);
    return $c->render( text => "bad", status => '400' ) if $res > 0;
    $sql       = $db->prepare(
        "insert into public.user values (default, \'$login\', \'$pass\', false);"
    ) or die "prepare statement failed: $db->errstr()";
    $sql->execute();
    $sql       = $db->prepare(
        "select login,is_admin from public.user where login = \'$login\' and password = \'$pass\';"
    ) or die "prepare statement failed: $db->errstr()";
    $sql->execute();
    $c->render( json => $sql->fetchrow_hashref );
};

options '/register' => sub ($c) {
    $c->render( text => "good", status => "200" );
};

options '/schedule' => sub ($c) {
    $c->render( text => "good", status => "200" );
};
options '/schedule/:id' => sub ($c) {
    $c->render( text => "good", status => "200" );
};

# Start the Mojolicious command system
$app->start;
