# Automatically enables "strict", "warnings", "utf8" and Perl 5.16 features
use Mojolicious::Lite -signatures;
use lib "./modules";
use Auth;
use DB;
use Mojolicious::Static;
use Mojo::Log;
use Data::Dumper;
use Mojo::JSON qw(decode_json encode_json);
plugin 'RenderFile';
my $app = app;
my $db  = db_connect();
my $log = Mojo::Log->new;
$app->plugin('SecureCORS');
$app->routes->to('cors.origin' => '*');
$app->hook(
    after_dispatch => sub {
        my $c = shift;
        $c->res->headers->header( 'Access-Control-Allow-Origin' => '*' );
        $c->res->headers->header(
            'Access-Control-Allow-Credentials' => 'true' );
        $c->res->headers->access_control_allow_origin('*');
        $c->res->headers->header( 'Access-Control-Allow-Methods' =>
              'GET, OPTIONS, POST, DELETE, PUT' );
        $c->res->headers->header(
            'Access-Control-Allow-Headers' => 'Content-Type' =>
              'application/x-www-form-urlencoded' );

    }
);

# my $static = $app->static;
# push @{$static->paths}, curfile->dirname->sibling('img')->to_string;

# Route with placeholder
get '/' => sub ($c) {
    $c->render( text => "hello" );
};

get '/editions' => sub ($c) {
    my $sql = $db->prepare("SELECT id, name, year from edition")
      or die "prepare statement failed: $db->errstr()";

    my @results = $db->selectall_arrayref( $sql, { Slice => {} } );

    $c->render( json => @results );
};

get '/releases' => sub ($c) {
    my $editionId = $c->param('id');
    my $sql       = $db->prepare(
        "SELECT r.id as id,a.name as author,c.page, title , r.contentId as \"contentId\"
from release r 
join author a on a.id = r.authorId
join content c on c.id = r.contentId 
where \"editionId\" = $editionId"
    ) or die "prepare statement failed: $db->errstr()";
    my @results = $db->selectall_arrayref( $sql, { Slice => {} } );

    $c->render( json => @results );
};

get '/content' => sub ($c) {
    my $id = $c->param('id');
    my $sql       = $db->prepare(
        "SELECT * from content where id = $id"
    ) or die "prepare statement failed: $db->errstr()";
    my @results = $db->selectall_arrayref( $sql, { Slice => {} } );

    $c->render( json => $results[0][0] );
};

get 'image/*img' => sub ($c) {
    my $img = $c->param('img');
    $c->render_file( 'filepath' => './img/' . $img );
};

# Start the Mojolicious command system
$app->start;
